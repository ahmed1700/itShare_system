const router = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/userAuthorization');
const { Category, Validate } = require('../models/category');
const { Employee } = require('../models/employees');

router.get('/', auth ,async (req, res, next) => {
    try {
        const category = await Category.find().sort('categoryID').select('-_id -__v');
        res.send({ result: true, data: category });
    } catch (err) {
        next(err);
    }
});
 

router.get('/categoriesName', auth ,async (req, res, next) => {
    try {
        const category = await Category.find().sort('categoryID').select('categoryName categoryID -_id');
        res.send({ result: true, data: category });
    } catch (err) { 
        next(err);
    }
});

router.get('/:id',auth , async (req, res, next) => {
    try {
        const category = await Category.findOne({ categoryID: req.params.id });
        if (!category) return res.send({ result: false, message: 'not found the Category' });
        res.send({ result: true, data: category });
    } catch (err) {
        next(err);
    }
});

router.post('/',auth , async (req, res, next) => {
    try {
        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const categoryName = await Category.findOne({categoryID:req.body.categoryID})
        if (categoryName) return res.send({ result: false, message: 'this category is already exist' });

        const category = new Category(_.pick(req.body, [
            'employeeID','categoryName'
        ]));
        if (!category) return res.send({ result: false, message: 'error in the DB' });

        await category.save();
        res.send({ result: true, data: category });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth , async (req, res, next) => {
    try {
        const { error } = Validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const category = await Category.findOneAndUpdate({ categoryID: req.params.id },_.pick(req.body, [
            'employeeID','categoryName'
        ]), { new: true, runValidators: true });
        if (!category) return res.send({ result: false, message: 'error in the DB' });

       
        res.send({ result: true, data: category });
    } catch (err) {
        next(err);
    }
});
module.exports = router;


