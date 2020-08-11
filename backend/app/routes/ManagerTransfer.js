const router = require('express').Router();
const _ = require('lodash');
const { Branch } = require('../models/branch')
const { Payment } = require('../models/payments');
const { Employee } = require('../models/employees');
const { AssignStudent } = require('../models/assignStudent');
const { Course } = require('../models/courses');
const { Student } = require('../models/students');
const { Transfer} = require('../models/transfer');
const {mangerTransfer} = require('../models/ManagerTransfer')
const auth = require('../middleware/userAuthorization');


router.get('/',auth, async (req, res, next) => {
    try {
        const transfer = await mangerTransfer.find();
        res.send({ result: true, data: transfer });
    } catch (err) {
        next(err);
    }
})

router.post('/', auth, async (req, res, next) => {
    //  try {
   

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

    let adminPermision = await mangerTransfer.findOne({ assignStudentID: req.body.assignStudentID, oldCourseID: req.body.oldCourseID ,newCourseID:req.body.newCourseID});
     if(!adminPermision) {
         let permision = new mangerTransfer(
            _.pick(req.body, [
                'employeeID',
                'oldCourseID',
                'newCourseID',
                'assignStudentID',
                'branchID',
                'newTotalPayment',
                'comment'
            ]));

            await permision.save();

        return res.send({ result: false, message: 'we send to admin please wait his permision' });

     } 

      if(adminPermision&&adminPermision.status=='waiting'){
        return res.send({ result: false, message: 'still waiting for admin permision' });
      }

      if(adminPermision&&adminPermision.status=='refused'){
        return res.send({ result: false, message: 'admin refused' });
      }

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
            'newTotalPayment'
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
        courseTracks:req.body.courseTracks
    })

    transfer.paid = totalPayment
    await transfer.save();

    res.send({ result: true, data: transfer });
    // } catch (err) {
    //     next(err);
    // }

});

router.put('/:id', auth, async (req, res, next) => {

    try {
        const transferID = await mangerTransfer.findOne({ mangerTransferID: req.params.id });
        if (!transferID) return res.send({ result: false, message: 'the transferID is not correct' });

        const updateStatus = await mangerTransfer.findOneAndUpdate({ mangerTransferID: req.params.id },
            _.pick(req.body,
                [
                    'status'
                ]), { new: true, runValidators: true, });

        if (!updateStatus) return res.send({ result: false, message: 'the updateStatus failed' });
        res.send({ result: true, data: updateStatus });
    } catch (err) {
        next(err);
    }
});
module.exports = router;