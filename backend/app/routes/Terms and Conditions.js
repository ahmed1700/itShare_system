const router = require('express').Router();
const _ = require('lodash');
const { Terms } = require('../models/Terms and Conditions')
const auth = require('../middleware/userAuthorization');

router.get('/', auth, async (req, res, next) => {
    try {
        const terms = await Terms.find();
        res.send({ result: true, data: terms });
    } catch (err) {
        next(err);
    }
});



router.get('/:id', auth, async (req, res, next) => {
    //terms history
    const terms = await Terms.find({ termsID: req.params.id });
    res.send({ result: true, data: terms });
});




router.post('/', auth, async (req, res, next) => {
    try {

        const terms = await new Terms(
            _.pick(req.body, [
                'Terms'
            ]));



        await terms.save();

        res.send({ result: true, data: terms });
    } catch (err) {
        next(err);
    }

});
router.put('/:id',auth, async (req, res, next) => {
    try {


        const terms = await Terms.findOneAndUpdate({ termsID: req.params.id },
            _.pick(req.body, [
                'Terms',
            ]), { new: true, runValidators: true });
        if (!terms) return res.send({ result: false, message: 'the Terms with the given ID was not found' });
        res.send({ result: true, data: terms });
    } catch (err) {
        next(err);
    }
});
module.exports = router;