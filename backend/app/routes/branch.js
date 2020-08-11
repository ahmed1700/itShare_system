const router = require('express').Router();
const _ = require('lodash');
const { Branch, validate } = require('../models/branch');
const auth = require('../middleware/userAuthorization')
const adminAuth = require('../middleware/adminAuthorization')

 //  , [auth,adminAuth]
router.get('/' , auth ,async (req, res, next) => {
    try {
        const branch = await Branch.find().sort('branchID').select('-_id -__v');
        res.send({result:true,data:branch});
    } catch (err) { 
        next(err);
    }
});

router.get('/:id',auth , async (req, res, next) => {
    try {
        const branch = await Branch.findOne({ branchID: req.params.id });
        if (!branch) return res.send({result:false,message:'not found the Branch'});
        res.send({result:true,data:branch});
    } catch (err) {
        next(err);
    }
});
router.post('/',auth , async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});

        const branchName= await Branch.findOne({name:req.body.name});
        if(branchName) return res.send({result:false,message:'This branch is already exist'})

        const branch = new Branch(_.pick(req.body, [
            'name', 'address', 'details', 'ip' ,'ip2','ip3','homeTel1','homeTel2','mobile1','mobile2', 'email'
        ]));
        if (!branch) return res.send({result:false,message:'error in the DB'});

        await branch.save();
        res.send({result:true,data:branch});
    } catch (err) {
        next(err);
    }
});
router.put('/:id', auth , async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({result:false,message:error.details[0].message});

        const updateBranch = await Branch.findOneAndUpdate({ branchID: req.params.id },
            _.pick(req.body, [
                'name', 'address', 'details', 'ip' ,'ip2','ip3','homeTel1','homeTel2','mobile1','mobile2', 'email'
            ]), { new: true, runValidators: true });
        if (!updateBranch) return res.send({result:false,message:'Not found the branch with given ID'});

        res.send({result:true,data:updateBranch});
    } catch (err) {
        next(err);
    }
});
module.exports = router;


