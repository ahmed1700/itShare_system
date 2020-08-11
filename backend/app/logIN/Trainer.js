const express = require('express');
const router = express.Router();
const { Trainer } = require('../models/trainers');
const jwt = require('jsonwebtoken');

   
router.post('/', async (req, res, next) => {
    try {

        const trainer = await Trainer.findOne({ email: req.body.email, password: req.body.password });
        if (!trainer) {
            return res.send({ result: false, message: 'invalid email or password' });
        };
   

        const token = jwt.sign({ trainerID: trainer.trainerID, email: trainer.email,fullNameEnglish:trainer.fullNameEnglish },'123456');
        res.header('x-auth-token', token).send({
              result: true, data: {
                  'trainerID': trainer.trainerID,
                  'fullNameArabic': trainer.fullNameArabic,
                  'fullNameEnglish': trainer.fullNameEnglish,
                  'token': token
              }
          });
    } catch (err) { 
        next(err);
    }
});


module.exports = router;