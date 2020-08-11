const router = require('express').Router();
const _ = require('lodash');
const { Provider, validate } = require('../models/providers');
const { Employee } = require('../models/employees');
const auth = require('../middleware/userAuthorization');

router.get('/', auth, async (req, res,next) => {
    try {
        const providers = await Provider.find().sort('providerID').select('-_id -__v');
        res.send({result:true,data:providers});
    } catch (err) {
        next(err);
    }
});

router.get('/:id', auth,  async (req, res,next) => {
    try {
        const provider = await Provider.findOne({ providerID: req.params.id });
        if (!provider) res.send({result:false,message:'the provider with the given ID was not found'});

        res.send({result:true,data:provider});
    } catch (err) {
        next(err);
    }
});

router.post('/',auth,  async (req, res,next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID ,status:'active'});
        if (!employeeID) return res.send({result:false,message:'the employeeID is not correct'});

        let providerName =await Provider.findOne({providerName:req.body.providerName});
        if(providerName) return res.send({result:false,message:'this provider is already exist'});

        const provider = new Provider(_.pick(req.body, [
            'employeeID',
            'providerName',
            'providerDesc',
        ]));
   
    
        await provider.save();
        res.send({result:true,data:provider});
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth,  async (req, res,next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send(error.details[0].message);

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID,status:'active'});
        if (!employeeID) return res.send({result:false,message:'the employeeID is not correct'});

        const updateProvider = await Provider.findOneAndUpdate({ providerID: req.params.id },
            _.pick(req.body, [
                'employeeID',
                'providerName',
                'providerDesc',
            ]), { new: true, runValidators: true});
        if (!updateProvider) return res.send({result:false,message:'the Provider with the given ID was not found'});
        res.send({result:true,data:updateProvider});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
