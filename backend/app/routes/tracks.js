const router = require('express').Router();
const _ = require('lodash');
const { Track, validate } = require('../models/tracks');
const auth = require('../middleware/userAuthorization');


router.get('/', auth, async (req, res,next) => {
    try {
        const track = await Track.find().sort('trackID').select('-_id -__v');
        res.send({result:true,data:track});
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth, async (req, res,next) => {
    try {
        const track = await Track.findOne({ trackID: req.params.id });
        if (!track) return res.send({result:false,message:'the track with the given ID was not found'});
        res.send({result:true,data:track});
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async (req, res,next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});

        let trackName = await Track.findOne({trackName:req.body.trackName});
        if(trackName)  return res.send({result:false,message:'this track is already exist'});

        const track = new Track(_.pick(req.body,
            [
                'trackName',
                'trackHours',
                'price',
                'trackOutline'
            ]));
        await track.save();
        res.send({result:true,data:track});
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth, async (req, res,next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});

        const updatetrack = await Track.findOneAndUpdate({ trackID: req.params.id },
            _.pick(req.body, [
                'trackName',
                'trackHours',
                'price',
                'trackOutline'
            ]), { new: true, runValidators: true, });

        if (!updatetrack) return res.send({result:false,message:'the track with the given ID was not found'});

        res.send({result:true,data:updatetrack});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
