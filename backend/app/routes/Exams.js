const router = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/userAuthorization');
const { Exam, Validate } = require('../models/Exams');
const { Employee } = require('../models/employees');

router.get('/',auth, async (req, res, next) => {
    try {
        const exam = await Exam.find().sort('examID').select('-_id -__v');
        res.send({ result: true, data: exam });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth,  async (req, res, next) => {
    try {
        const exam = await Exam.findOne({ examID: req.params.id });
        if (!exam) return res.send({ result: false, message: 'not found the Exam' });
        res.send({ result: true, data: exam });
    } catch (err) {
        next(err);
    }
}); 

router.post('/', auth,  async (req, res, next) => {
    try {
        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const exam = new Exam(_.pick(req.body, [
            'employeeID','providerID', 'examName', 'examCode', 'examPrice','examCurrentPrice'
        ]));
        if (!exam) return res.send({ result: false, message: 'error in the DB' });

        await exam.save();
        res.send({ result: true, data: exam });
    } catch (err) {
        next(err);
    }
});

router.put('/:id',auth,  async (req, res, next) => {
    try {
        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const updateExam = await Exam.findOneAndUpdate({ examID: req.params.id },
            _.pick(req.body, [
                'employeeID','providerID', 'examName', 'examCode', 'examPrice','examCurrentPrice'
            ]), { new: true, runValidators: true });
        if (!updateExam) return res.send({ result: false, message: 'Not found the Exam with given ID' });

        res.send({ result: true, data: updateExam });
    } catch (err) {
        next(err);
    }
});
module.exports = router;


