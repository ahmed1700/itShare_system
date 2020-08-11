const router = require('express').Router();
const _ = require('lodash');
const { AlternativeAttendant, validate } = require('../models/alternatveAttendance');
const { Group } = require('../models/groups');
const { Trainer } = require('../models/trainers');
const { Track } = require('../models/tracks');
const { Course } = require('../models/courses');
const auth = require('../middleware/userAuthorization');
router.get('/',auth , async (req, res, next) => {
    try {
        const alternativeAttendant = await AlternativeAttendant.find().sort({'alternativeAttendantID':-1}).select('-_id -__v');
        res.send({ result: true, data: alternativeAttendant });
    } catch (err) {
        next(err);
    }
});


router.post('/delarWorkingGroupByBranch',auth , async (req, res, next) => {
    try {
        const alternativeAttendant = await AlternativeAttendant.find().sort('alternativeAttendantID').select('-_id -__v');
        res.send({ result: true, data: alternativeAttendant });
    } catch (err) {
        next(err);
    }
});

router.get('/:id',auth , async (req, res, next) => {
    try {
        const alternativeAttendant = await AlternativeAttendant.findOne({ alternativeAttendantID: req.params.id }).select('-_id -__v');
        if (!alternativeAttendant) return res.send({ result: false, message: 'the AlternativeAttendant with the given ID was not found' });
        res.send({ result: true, data: alternativeAttendant });
    } catch (err) {
        next(err);
    }
});

router.post('/trainer', async (req, res, next) => {
    try {
        const alternativeAttendant = await AlternativeAttendant.find({ trainerID: req.body.trainerID }).select('-_id -__v');
        if (!alternativeAttendant) return res.send({ result: false, message: 'the AlternativeAttendant with the given ID was not found' });
        res.send({ result: true, data: alternativeAttendant });
    } catch (err) {
        next(err);
    }
});

router.post('/', auth , async (req, res, next) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });


        const group = await Group.findOne({ groupID: req.body.groupID });
        if (!group) { return res.send({ result: false, message: 'the groupID is not correct' }) }

        if (group.groupStatus != 'working') return res.send({ result: false, message: `this group is${groupStatus}` });

        const trainer = await Trainer.findOne({ trainerID: req.body.trainerID });
        if (!trainer) { return res.send({ result: false, message: 'the trainerID is not correct' }) }
        

        let {  trackID, trainerID } = req.body
       
            // لو التراك والمدرب ده مش موجودين في تراكات الجروب
            const track = await Track.findOne({ trackID: req.body.trackID });
            if (!track) { return res.send({ result: false, message: 'the trackID is not correct' }) }
            const exist = group.groupTracks.find(p => p.trackID === trackID && p.trainerID === trainerID);
            if (!exist) { return res.send({ result: false, message: 'the trackID is not correct' }) }

        

        let alternativeAttendant = new AlternativeAttendant(
            {
                'groupID': req.body.groupID,
                'trainerID': req.body.trainerID,
                'trackID': req.body.trackID,
                'HourFrom': req.body.HourFrom,
                'HourTo': req.body.HourTo,
                'class': req.body.class,
                'date': req.body.date
            }
        )


        if (!alternativeAttendant) return res.send({ result: false, message: 'error in the DB' });

        await alternativeAttendant.save();
        return res.send({ result: true, data: alternativeAttendant });
    } catch (err) {
        next(err);
    }


});
router.put('/:id', auth ,async (req, res, next) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });


        const group = await Group.findOne({ groupID: req.body.groupID });
        if (!group) { return res.send({ result: false, message: 'the groupID is not correct' }) }

        if (group.groupStatus != 'working') return res.send({ result: false, message: `this group is${groupStatus}` });

        const trainer = await Trainer.findOne({ trainerID: req.body.trainerID });
        if (!trainer) { return res.send({ result: false, message: 'the trainerID is not correct' }) }
        

        let {  trackID, trainerID } = req.body
        
            // لو التراك والمدرب ده مش موجودين في تراكات الجروب
            const track = await Track.findOne({ trackID: req.body.trackID });
            if (!track) { return res.send({ result: false, message: 'the trackID is not correct' }) }
            const exist = group.groupTracks.find(p => p.trackID === trackID && p.trainerID === trainerID);
            if (!exist) { return res.send({ result: false, message: 'the trackID is not correct' }) }
    
        
        let updateAlternativeAttendant = await AlternativeAttendant.findOneAndUpdate({ alternativeAttendantID: req.params.id },
            {
                'groupID': req.body.groupID,
                'trainerID': req.body.trainerID,
                'trackID': req.body.trackID,
                'HourFrom': req.body.HourFrom,
                'HourTo': req.body.HourTo,
                'class': req.body.class,
                'date': req.body.date
            }, { new: true, runValidators: true });

           

        if (!updateAlternativeAttendant) return res.send({ result: false, message: 'error in DB' });

        res.send({ result: true, data: updateAlternativeAttendant });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 