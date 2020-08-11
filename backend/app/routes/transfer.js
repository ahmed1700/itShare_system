const router = require('express').Router();
const _ = require('lodash');
const { Branch } = require('../models/branch')
const { Payment } = require('../models/payments');
const { Employee } = require('../models/employees');
const { AssignStudent } = require('../models/assignStudent');
const { Course } = require('../models/courses');
const { Transfer, validate } = require('../models/transfer');
const auth = require('../middleware/userAuthorization');


router.get('/:id', auth, async (req, res, next) => {
    try {
        const transfer = await Transfer.find({ assignStudentID: req.params.id });
        res.send({ result: true, data: transfer });
    } catch (err) {
        next(err);
    }
})

router.post('/', auth, async (req, res, next) => {
      try {
    const { error } = validate(req.body);
    if (error) return res.send({ result: false, message: error.details[0].message });

    const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
    if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

    const assignStudent = await AssignStudent.findOne({ assignStudentID: req.body.assignStudentID });
    if (!assignStudent) return res.send({ result: false, message: ' the assignStudent is not correct' });

    const oldCourseID = await Course.findOne({ courseID: req.body.oldCourseID });
    if (!oldCourseID) return res.send({ result: false, message: 'the cousreID is not correct' });

    const newCourseID = await Course.findOne({ courseID: req.body.newCourseID });
    if (!newCourseID) return res.send({ result: false, message: 'the newCourseID is not correct' });

    let branchID = await Branch.findOne({ branchID: req.body.branchID });
    if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });

    const inpayments = await Payment.find({ assignStudentID: req.body.assignStudentID, courseID: req.body.oldCourseID, tranactionType: 'in' });


    let inpaid = 0;
    if (inpayments) {
        for (const p of inpayments) { inpaid += p.paid; }
    }
    const outpayments = await Payment.find({ assignStudentID: req.body.assignStudentID, courseID: req.body.oldCourseID, tranactionType: 'out' });
    let outpaid = 0;
    if (outpayments)
    // get remaing from payment History
    {
        for (const p of outpayments) { outpaid += p.paid; }
    }
    let totalPayment = inpaid - outpaid;
  
    let { newTotalPayment } = req.body;

    if (totalPayment > newTotalPayment) return res.send({ result: false, message: 'the new totalPayment is more than paid ' })

    let transfer = await new Transfer(
        _.pick(req.body, [
            'employeeID',
            'oldCourseID',
            'newCourseID',
            'assignStudentID',
            'branchID',
            'newTotalPayment',
            'comment'
        ]));


    let { groupID } = req.body;
    //اتاكدت ان الطالب متسجلش قبل كده  المشكله ان لو هو سجل في كورس تاني فبالتالي 
    const assignStudentID = await AssignStudent.findOne({ studentID: req.body.studentID, courseID: req.body.newCourseID });
    if (assignStudentID) {
        if (assignStudentID.groupID == null)
            return res.send({ result: false, message: 'the student is assigned before to this course' });
    }
    if (assignStudentID && groupID != null) {
        if (assignStudentID.groupID == groupID) {
            return res.send({ result: false, message: 'the student is assigned before to this course' });
        }
    }

    let updatePayment = await Payment.updateMany({ assignStudentID: req.body.assignStudentID, courseID: req.body.oldCourseID }, {
        courseID: req.body.newCourseID,

    }, { new: true, runValidators: true, context: 'query' });



    let updateAssign = await AssignStudent.findOneAndUpdate({ assignStudentID: req.body.assignStudentID, courseID: req.body.oldCourseID }, {
        courseID: req.body.newCourseID,
        totalPayment: req.body.newTotalPayment,
        groupID: req.body.groupID,
        courseTracks: req.body.courseTracks,
        branchID: req.body.branchID,
        employeeID: req.body.employeeID,
        courseTracks:req.body.courseTracks,
        isUpdated:true
    })

    transfer.paid = totalPayment
    await transfer.save();

    res.send({ result: true, data: transfer });
    } catch (err) {
        next(err);
    }

});
module.exports = router;