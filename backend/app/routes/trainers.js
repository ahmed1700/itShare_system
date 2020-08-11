const router = require('express').Router();
const _ = require('lodash');
const { Trainer, validate } = require('../models/trainers');
const { Employee } = require('../models/employees');
const auth = require('../middleware/userAuthorization');

router.get('/',auth, async (req, res,next) => {
    try {
    const trainers = await Trainer.find().sort('name').select('-__v');
    res.send({result:true,data:trainers});
} catch (err) {
    next(err);
}
});

router.get('/:id',auth, async (req, res,next) => {
    try {
    const trainer = await Trainer.findOne({ trainerID: req.params.id }).select('-_id -__v');
    if (!trainer) return res.send({result:false,message:'the trainer not found'});

    res.send({result:true,data:trainer});
} catch (err) {
    next(err);
}
});

router.post('/',auth, async (req, res,next) => {
    try {
    const { error } = validate(req.body);
    if (error) return res.send({result:false,message:error.details[0].message});

    const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
    if (!employeeID) return res.send({result:false,message:'the employeeID is not correct'});

    const nationalID = await Trainer.findOne({ nationalID: req.body.nationalID });
    if (nationalID) return res.send({result:false,message:'the nationalID is exist'});

    const mobile1 = await Trainer.findOne({ mobile1: req.body.mobile1 });
    if (mobile1) return res.send({result:false,message:'the mobile1 is exist'});
 
    const mobile2 = await Trainer.findOne({ mobile2: req.body.mobile2 });
    if (mobile2) return res.send({result:false,message:'the mobile2 is exist'});
  

    let email = await Trainer.findOne({ email: req.body.email });
    if (email) return res.send({result:false,message:'the trainer is exist'});

    trainer = new Trainer(
        _.pick(req.body,
            [
                'employeeID',
                'fullNameArabic',
                'fullNameEnglish',
                'nationalID',
                'mobile1',
                'mobile2',
                'email',
                'gender',
                'city',
                'address',
                'contractType',
                'password'
            ]));
    await trainer.save();
    res.send({result:true,data:trainer});
} catch (err) {
    next(err);
}
});

router.put('/:id', auth, async (req, res,next) => {
    
    try {
    const { error } = validate(req.body);
    if (error) return res.send({result:false,message:error.details[0].message});
    
    const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
    if (!employeeID) return res.send({result:false,message:'the employeeID is not correct'});

    const updateTrainer = await Trainer.findOneAndUpdate({ trainerID: req.params.id },
        _.pick(req.body,
            [
                'employeeID',
                'fullNameArabic',
                'fullNameEnglish',
                'nationalID',
                'mobile1',
                'mobile2',
                'email',
                'gender',
                'city',
                'address',
                'contractType',
                'password'
            ]), { new: true, runValidators: true, });

    if (!updateTrainer) return res.send({result:false,message:'the trainer with the given ID was not found...'});
    res.send({result:true,data:updateTrainer});
} catch (err) {
    next(err);
}
});

router.put('/changepassword/:id', auth, async (req, res,next) => {
    
    try {
    const trainerID = await Trainer.findOne({ trainerID: req.params.id});
    if (!trainerID) return res.send({result:false,message:'the trainerID is not correct'});

    const updateTrainer = await Trainer.findOneAndUpdate({ trainerID: req.params.id },
        _.pick(req.body,
            [
                'password' 
            ]), { new: true, runValidators: true, });

    if (!updateTrainer) return res.send({result:false,message:'the trainer with the given ID was not found...'});
    res.send({result:true,data:updateTrainer});
} catch (err) {
    next(err);
}
});

module.exports = router;
