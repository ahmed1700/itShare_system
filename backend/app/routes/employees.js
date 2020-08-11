const router = require('express').Router();
const _ = require('lodash');
const { Employee, validate } = require('../models/employees');
const { Branch } = require('../models/branch');
const { Loan } = require('../models/loan');
const auth = require('../middleware/userAuthorization');
router.get('/',auth, async (req, res, next) => {
    try {
        const employee = await Employee.find().sort('employeeID').select('-_id -__v');
        const loan = await Loan.aggregate([
            { $addFields: { "month": { $month: '$creationDate' } } },
            { $match: { month: new Date().getMonth() + 1 } }
        ]);
        res.send({ result: true, data: employee, loan: loan });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth, async (req, res, next) => {
    try {
        const employee = await Employee.findOne({ employeeID: req.params.id }).select('-_id -__v');
        const loan = await Loan.find({ employeeID: req.params.id })
        if (!employee) return res.send({ result: false, message: 'the employee with the given ID was not found' });
        res.send({ result: true, data: employee, loan: loan });
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async (req, res, next) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const nationalID = await Employee.findOne({ nationalID: req.body.nationalID });
        if (nationalID) return res.send({ result: false, message: 'the nationalID is exist' });

        const mobile1 = await Employee.findOne({ mobile1: req.body.mobile1 });
        if (mobile1) return res.send({ result: false, message: 'the mobile1 is exist' });

        const homeTel = await Employee.findOne({ homeTel: req.body.homeTel });
        if (homeTel) return res.send({ result: false, message: 'the homeTel is exist' });

        const mobile2 = await Employee.findOne({ mobile2: req.body.mobile2 });
        if (mobile2) return res.send({ result: false, message: 'the mobile2 is exist' });

        let email = await Employee.findOne({ email: req.body.email });
        if (email) return res.send({ result: false, message: 'the email already registration' });

        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });

        let employee = new Employee(_.pick(req.body,
            [
                'fullNameArabic',
                'fullNameEnglish',
                'nationalID',
                'homeTel',
                'mobile1',
                'mobile2',
                'email',
                'gender',
                'city',
                'address',
                'branchID',
                'status',
                'password',
                'salary',
                'role'
            ]));



        await employee.save();
        res.send({ result: true, data: employee });
    } catch (err) {
        next(err);
    }
});


router.put('/:id',auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });


        let updateEmployee = await Employee.findOneAndUpdate({ employeeID: req.params.id },
            _.pick(req.body, [
                'fullNameArabic',
                'fullNameEnglish',
                'nationalID',
                'homeTel',
                'mobile1',
                'mobile2',
                'email',
                'gender',
                'city',
                'address',
                'branchID',
                'status',
                'salary',
                'role'
            ]), { new: true, runValidators: true, context: 'query', upsert: true });


        if (!updateEmployee) return res.send({ result: false, message: 'the employee with the given ID was not found' });
        res.send({ result: true, data: updateEmployee });

    } catch (err) {
        next(err);
    }
});

router.put('/changepassword/:id', auth, async (req, res, next) => {
    try {



        let updateEmployee = await Employee.findOneAndUpdate({ employeeID: req.params.id },
            _.pick(req.body, [
                'password',
            ]), { new: true, runValidators: true, context: 'query', upsert: true });


        if (!updateEmployee) return res.send({ result: false, message: 'the employee with the given ID was not found' });
        res.send({ result: true, data: updateEmployee });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
