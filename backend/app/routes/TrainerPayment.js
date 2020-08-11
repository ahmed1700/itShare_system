const router = require('express').Router();
const _ = require('lodash');
const { TrainerPayment, validate } = require('../models/TtrainerPayment');
const { Group } = require('../models/groups');
const { Trainer } = require('../models/trainers');
const { Track } = require('../models/tracks');
const { TeacheingAttendant } = require('../models/teacheingAttendant');
const auth = require('../middleware/userAuthorization');


router.get('/', async (req, res, next) => {
    try {
        const trainerPayment = await TrainerPayment.find().sort('TrainerPaymentID').select('-_id -__v');
        res.send({ result: true, data: trainerPayment });
    } catch (err) {
        next(err);
    }
});


router.get('/:id', auth, async (req, res, next) => {
    try {
        const trainerPayment = await TrainerPayment.findOne({ trainerPaymentID: req.params.id }).select('-_id -__v');
        if (!trainerPayment) return res.send({ result: false, message: 'the TrainerPayment with the given ID was not found' });
        res.send({ result: true, data: trainerPayment });
    } catch (err) {
        next(err);
    }
});

router.post('/trainer', async (req, res, next) => {
    try {
        const trainerPayment = await TrainerPayment.find({ trainerID: req.body.trainerID }).select('-_id -__v');
        if (!trainerPayment) return res.send({ result: false, message: 'the TrainerPayment with the given ID was not found' });
        res.send({ result: true, data: trainerPayment });
    } catch (err) {
        next(err);
    }
}); 

router.post('/', auth, async (req, res, next) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });


        const group = await Group.findOne({ groupID: req.body.groupID });
        if (!group) { return res.send({ result: false, message: 'the groupID is not correct' }) }


        const trainer = await Trainer.findOne({ trainerID: req.body.trainerID });
        if (!trainer) { return res.send({ result: false, message: 'the trainerID is not correct' }) }


        let { trackID, trainerID } = req.body

         // لو التراك والمدرب ده مش موجودين في تراكات الجروب
        const track = await Track.findOne({ trackID: req.body.trackID });
        if (!track) { return res.send({ result: false, message: 'the trackID is not correct' }) }
        const exist = group.groupTracks.find(p => p.trackID === trackID && p.trainerID === trainerID);
        if (!exist) { return res.send({ result: false, message: 'the trackID is not correct' }) }
        let attendant = await TeacheingAttendant.find({
            trainerID: req.body.trainerID,
            groupID: req.body.groupID, trackID: req.body.trackID
        })

        let teachedHour = attendant.reduce((a, b) => +a + +b.actualTeachedHours, 0);
        if (!teachedHour) {
            return res.send({ result: false, message: 'check if trainer sign out last lecture' })
        }
        let TotalPayedMoney = 0
        let totalPaid = await TrainerPayment.find({
            trainerID: req.body.trainerID,
            groupID: req.body.groupID, trackID: req.body.trackID
        })

        TotalPayedMoney = totalPaid.reduce((a, b) => +a + +b.paid, 0);

        if (req.body.paid > (teachedHour * (exist.trainerPricePerHour - TotalPayedMoney))) {
            return res.send({ result: false, message: 'The Paid is more than salary' })
        }
        let trainerPayment = new TrainerPayment(
            {
                'employeeID': req.body.employeeID,
                'groupID': req.body.groupID,
                'trainerID': req.body.trainerID,
                'trackID': req.body.trackID,
                'paid': req.body.paid
                
            }
        )
        trainerPayment.branchID = group.branchID
          let groupTrack = await Group.findOneAndUpdate({ groupID:req.body.groupID,'groupTracks': { $elemMatch: { trainerID: req.body.trainerID,trackID: req.body.trackID } }} ,{
            $set: {'groupTracks.$.isPaid': 'true'} 
          })


        if (!trainerPayment) return res.send({ result: false, message: 'error in the DB' });

        await trainerPayment.save();
        return res.send({ result: true, data: trainerPayment });
    } catch (err) {
        next(err);
    }


});


module.exports = router;