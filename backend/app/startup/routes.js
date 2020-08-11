    const express = require('express');
    const cors =require('cors');
    const students = require('../routes/students');
    const employees = require('../routes/employees');
    const trainers = require('../routes/trainers');
    const groups = require('../routes/groups');
    const providers = require('../routes/providers');
    const courses = require('../routes/courses');
    const payments = require('../routes/payments');
    const assignStudent = require('../routes/assignStudent');
    const branch = require('../routes/branch');
    const vacations = require('../routes/vacations');
    const teacheingAttendant = require('../routes/teacheingAttendant');
    const delayAttendat=require('../routes/delayAttendant');
    const tracks=require('../routes/tracks');
    const AlternativeAttendan=require('../routes/alternativeAttendant')
    const transfer=require('../routes/transfer')
    const employeeLogIn =require('../logIN/Employee');
    const trainerLogIn = require('../logIN/Trainer');
    const refund = require('../routes/refund');
    const managertranfer =require('../routes/ManagerTransfer');
    const exams =require('../routes/Exams');
    const loans =require('../routes/loan');
    const terms =require('../routes/Terms and Conditions');
    const trainerPayment =require('../routes/TrainerPayment');
    const categories =require('../routes/category');
    const publicPayment =require('../routes/publicPayment');
    const studentExam =require('../routes/student_exam');
    const studentAttent =require('../routes/studentAttendant');
    require('../../')
    module.exports = (app) => {
        app.use(cors());
        
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/assignStudent',assignStudent);
        app.use('/teacheingAttendant',teacheingAttendant);
        app.use('/branch',branch);
        app.use('/students', students);
        app.use('/employees', employees);
        app.use('/trainers', trainers);
        app.use('/groups', groups);
        app.use('/providers', providers);
        app.use('/courses', courses);
        app.use('/payments', payments);
        app.use('/vacations', vacations);
        app.use('/delayAttendant', delayAttendat); 
        app.use('/tracks', tracks);
        app.use('/alternativeAttendan', AlternativeAttendan);
        app.use('/transfer', transfer);
        app.use('/employeeLogIn', employeeLogIn);
        app.use('/trainerLogIn', trainerLogIn);
        app.use('/refund', refund);
        app.use('/managertranfer', managertranfer);
        app.use('/exams', exams);
        app.use('/loans', loans);
        app.use('/terms', terms);
        app.use('/trainerPayment', trainerPayment);
        app.use('/categories', categories);
        app.use('/publicPayment', publicPayment);
        app.use('/studentExam', studentExam);
        app.use('/studentAttend', studentAttent);


        app.get('/', function(req, res){
            res.redirect(terms);
         });
        app.get('*', (req, res) => {
            res.status(400).send('Invalid Url');
        });

        app.post('*', (req, res) => {
            res.status(400).send('Invalid Url');
        });

        app.put('*', (req, res) => {
            res.status(400).send('Invalid Url');
        });

        app.use(function(err,req,res,next){
            if (err.code === 11000) {
                return res.json('Duplicate ' + err.errmsg.split("index:")[1].split("dup key")[0].split("_")[0]);
            }
            console.log('err',err)
            return res.json(err);
          })
    };