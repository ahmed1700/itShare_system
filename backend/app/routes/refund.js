const router = require('express').Router();
const _ = require('lodash');
const { Branch } = require('../models/branch')
const { Payment } = require('../models/payments');
const { Employee } = require('../models/employees');
const { AssignStudent } = require('../models/assignStudent');
const { Course } = require('../models/courses');
const { Student } = require('../models/students');
const { refund, validate } = require('../models/refunds')
const auth = require('../middleware/userAuthorization');

router.get('/',auth , async (req, res, next) => {
    try {
        const refunds = await refund.find();
        res.send({ result: true, data: refunds });
    } catch (err) {
        next(err);
    }
});

router.post('/', auth ,  async (req, res, next) => {
    try {


        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });

        const assignStudent = await AssignStudent.findOne({ assignStudentID: req.body.assignStudentID, courseID: req.body.courseID });
        if (!assignStudent) return res.send({ result: false, message: ' the assignStudent is not correct' });


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
       
        if (req.body.tranactionType == 'in') {
            if (req.body.paid > remaingPayment) {
                return res.send({ result: false, message: `The Paid is More Than TotalPayment` });
            }
        }
        if (req.body.tranactionType == 'out') {
            if (req.body.paid > (inpaid - outpaid)) {
                return res.send({ result: false, message: `The Refund is More Than Paid` });
            }
        }

        let refundCheck = await refund.findOne({ assignStudentID: req.body.assignStudentID, courseID: req.body.courseID,paid:req.body.paid });
        if (!refundCheck) {
            const Refund = await new refund(
                _.pick(req.body, [
                    'employeeID',
                    'studentID',
                    'courseID',
                    'paid',
                    'assignStudentID',
                    'comment'
                ]));
            await Refund.save()
            return res.send({ result: false, message: `Refund send Succefullly to Admin` });

        }

        if (refundCheck && refundCheck.status == "waiting") {
            return res.send({ result: false, message: `Still waiting for admin ` });
        }

        if (refundCheck && refundCheck.status == "refused") {
            return res.send({ result: false, message: `Admin refuesed this refund` });
        }
        const payment = await new Payment(
            _.pick(req.body, [
                'employeeID',
                'studentID',
                'paid',
                'paymentType',
                'tranactionType',
                'courseID',
                'assignStudentID',
                'branchID'
            ]));



        await payment.save();

        res.send({ result: true, data: payment });
    } catch (err) {
        next(err);
    }

});

router.put('/:id', auth ,  async (req, res, next) => {

    try {
        const refundID = await refund.findOne({ refundID: req.params.id });
        if (!refundID) return res.send({ result: false, message: 'the refundID is not correct' });

        const updaterefund = await refund.findOneAndUpdate({ refundID: req.params.id },
            _.pick(req.body,
                [
                    'status'
                ]), { new: true, runValidators: true, });

        if (!updaterefund) return res.send({ result: false, message: 'the updaterefund failed' });
        res.send({ result: true, data: updaterefund });
    } catch (err) {
        next(err);
    }
});

module.exports = router;