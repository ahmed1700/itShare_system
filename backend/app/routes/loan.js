const router = require('express').Router();
const _ = require('lodash');
const { Loan, validate } = require('../models/loan');
const { Employee } = require('../models/employees');
const auth = require('../middleware/userAuthorization');

router.get('/',auth, async (req, res, next) => {
    try {
        const loan = await Loan.find().sort('loanID').select('-_id -__v');
        res.send({ result: true, data: loan });
    } catch (err) { 
        next(err);
    }
});

router.get('/:id', auth,  async (req, res, next) => {
    try {
        const loan = await Loan.findOne({ loanID: req.params.id });
        if (!loan) return res.send({ result: false, message: 'not found the Loan' });
        res.send({ result: true, data: Loan });
    } catch (err) {
        next(err);
    }
});

router.post('/', auth,  async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const loan = new Loan(_.pick(req.body, [
            'employeeID', 'loanValue'
        ]));
        if (!loan) return res.send({ result: false, message: 'error in the DB' });
         
        loan.branchID =  employeeID.branchID
        await loan.save();
        res.send({ result: true, data: loan });
    } catch (err) {
        next(err);
    }
});



router.post('/findByMonth', auth,  async (req, res, next) => {
    try {
        let { month } = req.body
        const loan = await Loan.aggregate([
            { $addFields: { "month": { $month: '$creationDate' } } },
            { $match: { month: month } }
        ]);

        res.send({ result: true, data: loan });
    } catch (err) {
        next(err);
    }
});


module.exports = router;


