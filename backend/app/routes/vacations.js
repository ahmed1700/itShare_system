const router = require('express').Router();
const _ = require('lodash');
const moment = require('moment');
const auth = require('../middleware/userAuthorization');

const { Vacation, validate } = require('../models/vacations');

router.get('/',auth, async (req, res) => {
    try {
        const vacation = await Vacation.find({}).sort('vacationID').select('-_id -__v');
        res.send({result:true,data:vacation});
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth, async (req, res,next) => {
    try {
        const vacation = await Vacation.find({ vacationID: req.params.id });
        if (!vacation) return res.send({result:false,message:'not found the Vacation'});
        res.send({result:true,data:vacation});
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});
         let vacationDate= await Vacation.findOne({date:req.body.date});
         if(vacationDate)  return res.send({result:false,message:'This vacation is already exist'});
        const vacation = new Vacation({
            'title': req.body.title,
            'date': req.body.date,
        }
        );
        let { date } = req.body

        let d = new Date(date);
        vacation.Date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        console.log(vacation.Date)
        vacation.indexDay = moment(vacation.date).format('DDD');
        if (!vacation) return res.send({result:false,message:'error in the DB'});
        await vacation.save();
        res.send({result:true,data:{ "title": req.body.title, 'Date': vacation.Date, 'indexDay': vacation.indexDay }});
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});
        const updateVacation = await Vacation.findOneAndUpdate({ vacationID: req.params.id },
            _.pick(req.body, [
                'title', 'date'
            ]), { new: true, runValidators: true });
        if (!updateVacation) return res.send({result:false,message:'error in DB'});
        res.send({result:true,data:updateVacation});
    } catch (err) {
        next(err);
    }
});
module.exports = router;


