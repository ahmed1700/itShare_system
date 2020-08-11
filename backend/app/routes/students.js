const router = require('express').Router();
const _ = require('lodash');
const { Student, validate } = require('../models/students');
const { Employee } = require('../models/employees');
const { Branch } = require('../models/branch');
const auth = require('../middleware/userAuthorization');


router.get('/',auth, async (req, res, next) => {
    try {
        const student = await Student.find().select('-_id -__v').sort({'studentID':-1});
               // get branch data 
        let branches = await Branch.find().select('name branchID -_id');
        res.send({ result: true, data: student,branches:branches});
    } catch (err) {
        next(err);
    }
});
router.post('/filterByBranch',auth, async (req, res, next) => {
    try {
        const student = await Student.find({ branchID: req.body.branchID });
        res.send({ result: true, data: student });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth, async (req, res, next) => {
    try {
        const student = await Student.findOne({ studentID: req.params.id }).select('-_id -__v');
        if (!student) res.send({ result: false, message: 'the student with the given ID was not found' });
        res.send({ result: true, data: student });
    } catch (err) {
        next(err);
    }
});

router.post('/',auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });


        const branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branchID is not correct' });



        const mobile1 = await Student.findOne({ mobile1: req.body.mobile1 });
        if (mobile1) return res.send({ result: false, message: 'the mobile1 is exist' });



        let student = await Student.findOne({ email: req.body.email });
        if (student) return res.send({ result: false, message: 'the student already registration' });

        student = new Student(_.pick(req.body,
            [
                'employeeID',
                'branchID',
                'fullNameArabic',
                'fullNameEnglish',
                'nationalID',
                'homeTell',
                'mobile1',
                'mobile2',
                'email',
                'gender',
                'studentsType',
                'city',
                'address',
                'password'

            ]));
        await student.save();
        res.send({ result: true, data: student });
    } catch (err) {
        next(err);
    }
});

router.put('/:id',auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branchID is not correct' });

        const updateStudent = await Student.findOneAndUpdate({ studentID: req.params.id },
            _.pick(req.body,
                [
                    'employeeID',
                    'branchID',
                    'fullNameArabic',
                    'fullNameEnglish',
                    'nationalID',
                    'homeTell',
                    'mobile1',
                    'mobile2',
                    'email',
                    'gender',
                    'studentsType',
                    'city',
                    'address',
                    'password'
                ]), { new: true, upsert: true });

        if (!updateStudent) return res.send({ result: false, message: 'the student with the given ID was not found...' });

        res.send({ result: true, data: updateStudent });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
