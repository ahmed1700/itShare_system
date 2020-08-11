const router = require('express').Router();
const _ = require('lodash');
const { StudentExam, Validate } = require('../models/student_exam');
const { Employee } = require('../models/employees');
const { Student } = require('../models/students');
const { Exam } = require('../models/Exams');
const { Branch } = require('../models/branch');
const auth = require('../middleware/userAuthorization');


router.get('/', auth ,async (req, res, next) => {
    try {
        let studentExam = await StudentExam.find();
         // get employees data
       let employeesID = studentExam.map(pay => pay.employeeID);
       let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
       // get branch data 
       let branch = await Branch.find().select('name branchID -_id');
       //get student data 
       let studentsID = studentExam.map(pay => pay.studentID);
       let students = await Student.find({ studentID: { $in: studentsID } }).select('studentID fullNameEnglish -_id');
        if (!studentExam) return res.send({ result: false, message: 'Something Error' });
        res.send({ result: true, data: studentExam ,employees: employees, branch: branch, students: students});
    } catch (err) {
        next(err);
    }
});

router.post('/employeePayment',auth , async (req, res, next) => {
    try {
        console.log(req.body)
       const examPayment = await StudentExam.find({branchID:req.body.branchID,creationDate:{$gte:new Date(req.body.date).setHours(00, 00, 00),$lte:new Date(req.body.date).setHours(23, 59, 59)}}).select('-_id -__v');

       // get employees data
       let employeesID = examPayment.map(pay => pay.employeeID);
       let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
       // get branch data 
       let branch = await Branch.find({ branchID: req.body.branchID }).select('name branchID -_id');
       //get student data 
       let studentsID = examPayment.map(pay => pay.studentID);
       let students = await Student.find({ studentID: { $in: studentsID } }).select('studentID fullNameEnglish -_id');

        res.send({ result: true, data: examPayment,employees: employees, branch: branch, students: students});
    } catch (err) {
        next(err);
    }
});


router.post('/assign', auth, async (req, res, next) => {
    try {
        const assignStudent = await StudentExam.find({ studentID: req.body.studentID });
        if (!assignStudent) return res.send({ result: false, message: 'not found the student' });
        res.send({ result: true, data: assignStudent });
    } catch (err) {
        next(err);
    }
});


router.get('/:id', auth, async (req, res, next) => {
    try {
        const studentExam = await StudentExam.findOne({ studentExamID: req.params.id });
        if (!studentExam) return res.send({ result: false, message: 'not found the student' });
        res.send({ result: true, data: studentExam });
    } catch (err) {
        next(err);
    }
});


router.post('/', auth, async (req, res, next) => {
//    try {
        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });
        //اتاكدت ان الطالب موجود
        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });
        //اتاكد ان الفرع مظبوط
        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });


        let studentExam = new StudentExam(
            _.pick(req.body,
                [
                    'branchID',
                    'employeeID',
                    'studentID',
                    'examID',
                    'code',
                    'totalPrice',
                    'originalPrice',
                     'paymentType',

                ]));


        if (!studentExam) return res.send({ result: false, message: 'error in DB' });

        await studentExam.save();
        res.send({ result: true, data: studentExam });
    // } catch (err) {
    //     next(err);
    // }
});

router.put('/:id',auth, async (req, res, next) => {

    try {

        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });
        //اتاكدت ان الطالب موجود
        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });
        //اتاكد ان الفرع مظبوط
        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });


        let updatestudentExam = await studentExam.findOneAndUpdate({ studentExamID: req.params.id },
            _.pick(req.body,
                ['branchID',
                    'employeeID',
                    'studentID',
                    'examID',
                    'code',
                    'totalPrice',
                    'originalPrice',
                    'paymentType',
                ]
            ), { new: true, runValidators: true });


        if (!updatestudentExam) return res.send({ result: false, message: 'error in DB' });

        res.send({ result: true, data: updatestudentExam });
    } catch (err) {
        next(err);
    }
});

module.exports = router;