const router = require('express').Router();
const _ = require('lodash');
const { Branch } = require('../models/branch')
const { Payment, validate } = require('../models/payments');
const { Employee } = require('../models/employees');
const { AssignStudent } = require('../models/assignStudent');
const { Course } = require('../models/courses');
const { Student } = require('../models/students');
const auth = require('../middleware/userAuthorization');


router.get('/',auth, async (req, res, next) => {
    try {
        const payments = await Payment.find();
         // get employees data
         let employeesID = payments.map(pay => pay.employeeID);
         let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
               // get branch data 
        let branch = await Branch.find().select('name branchID -_id');
         //get student data  
         let studentsID = payments.map(pay => pay.studentID);
         let students = await Student.find({ studentID: { $in: studentsID } }).select('studentID fullNameEnglish -_id');

        res.send({ result: true, data: payments, employees: employees, branch: branch, students: students });
    } catch (err) {
        next(err);
    }
});

// get courses payment for employee by date and branch
router.post('/employeePayment',auth, async (req, res, next) => {
    try { 
        const payment = await Payment.find({ branchID: req.body.branchID, creationDate: { $gte: new Date(req.body.date).setHours(00, 00, 00), $lte: new Date(req.body.date).setHours(23, 59, 59) } }).select('-_id -__v');
        // get employees data
        let employeesID = payment.map(pay => pay.employeeID);
        let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
        // get branch data 
        let branch = await Branch.find({ branchID: req.body.branchID }).select('name branchID -_id');
        //get student data 
        let studentsID = payment.map(pay => pay.studentID);
        let students = await Student.find({ studentID: { $in: studentsID } }).select('studentID fullNameEnglish -_id');
        res.send({ result: true, data: payment, employees: employees, branch: branch, students: students });
    } catch (err) {
        next(err);
    } 
});


router.post('/studentPayment/:id', auth, async (req, res, next) => {
    try {
        const payments = await Payment.find({ assignStudentID: req.params.id });
        res.send({ result: true, data: payments });
    } catch (err) {
        next(err);
    }
});




// send assignStudentID  to send totalpayment and remaining payment
router.post('/in/:id',auth, async (req, res, next) => {
    try {
        // الراجل ده عليه فلوس اد ايه
        const assignStudent = await AssignStudent.findOne({ assignStudentID: req.params.id });
        if (!assignStudent) return res.send({ result: false, message: ' the assignStudent is not correct' });

        let totalPayment = await assignStudent.totalPayment;


        const inpayments = await Payment.find({ assignStudentID: req.params.id, tranactionType: 'in' });

        let inpaid = 0;
        if (inpayments) {
            for (const p of inpayments) { inpaid += p.paid; }
        }

        const outpayments = await Payment.find({ assignStudentID: req.params.id, tranactionType: 'out' });
        let outpaid = 0;
        if (outpayments)
        // get remaing from payment Hestory
        {
            for (const p of outpayments) { outpaid += p.paid; }
        }
        let remaingPayment = totalPayment - (inpaid - outpaid);

        res.send({ totalPayment: totalPayment, remaingPayment: remaingPayment });
    } catch (err) {
        next(err);
    }

});



router.get('/all/:id',auth, async (req, res, next) => {
    //payment history
    const payments = await Payment.find({ studentID: req.params.id });
    res.send({ result: true, data: payments });
});

router.get('/payment/:id', auth, async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ paymentID: req.params.id });
        if (!payment) return res.send({ result: false, message: 'the payment is not found' });
        res.send(payment);
    } catch (err) {
        next(err);
    }
});


router.post('/', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });

        const assignStudent = await AssignStudent.findOne({ assignStudentID: req.body.assignStudentID, courseID: req.body.courseID });
        if (!assignStudent) return res.send({ result: false, message: ' the assignStudent is not correct' });

        const cousreID = await Course.findOne({ cousreID: req.body.cousreID });
        if (!cousreID) return res.send({ result: false, message: 'the cousreID is not correct' });

        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });

        const inpayments = await Payment.find({ assignStudentID: req.body.assignStudentID, courseID: req.body.courseID, tranactionType: 'in' });

        totalPayment = await assignStudent.totalPayment;
        let inpaid = 0;
        if (inpayments) {
            for (const p of inpayments) { inpaid += p.paid; }
        }
        const outpayments = await Payment.find({ assignStudentID: req.body.assignStudentID, courseID: req.body.courseID, tranactionType: 'out' });
        let outpaid = 0;
        if (outpayments)
        // get remaing from payment History
        {
            for (const p of outpayments) { outpaid += p.paid; }
        }
        let remaingPayment = totalPayment - (inpaid - outpaid);

        const payment = await new Payment(
            _.pick(req.body, [
                'employeeID',
                'studentID',
                'paid',
                'paymentType',
                'tranactionType',
                'courseID',
                'assignStudentID',
                'branchID',
                'comment'
            ]));

        if (payment.tranactionType == 'in') {
            if (payment.paid > remaingPayment) {
                return res.send({ result: false, message: `The Paid is More Than TotalPayment` });
            }
        } else {
            if (payment.paid > (inpaid - outpaid)) {
                return res.send({ result: false, message: `The Refund is More Than Paid` });
            }
        }

        await payment.save();

        res.send({ result: true, data: payment });
    } catch (err) {
        next(err);
    }

});
module.exports = router;