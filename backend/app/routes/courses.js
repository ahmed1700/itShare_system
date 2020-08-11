const router = require('express').Router();
const _ = require('lodash');
const { Employee } = require('../models/employees');
const { Provider } = require('../models/providers');
const { Track } = require('../models/tracks');
const { Course, validate } = require('../models/courses');
const { AssignStudent } = require('../models/assignStudent');
const { Group } = require('../models/groups');
const auth = require('../middleware/userAuthorization');
router.get('/',auth ,async (req, res, next) => {
    try {
        const courses = await Course.find({}).sort('courseID').select('-_id -__v');
        res.send({ result: true, data: courses });
    } catch (err) {
        next(err);
    }
});

router.get('/coursesName',auth , async (req, res, next) => {
    try {
        const courses = await Course.find().sort('courseID').select('-_id courseID courseName priceAfterDiscount courseTracks');
        res.send({ result: true, data: courses });
    } catch (err) {
        next(err);
    }
});

router.get('/:id',auth , async (req, res, next) => {
    try {
        let course = await Course.findOne({ courseID: req.params.id })

        const trackDetails = await Track.find({ trackID: { $in: (course.courseTracks.map(track => track.trackID)) } })
        if (!course) return res.send({ result: false, message: 'not found the course' });
        res.send({ result: true, data: course, tracks: trackDetails });
    } catch (err) {
        next(err);
    }
});

router.get('/courseTracks/:id', auth , async (req, res, next) => {
    try {
        let course = await Course.findOne({ courseID: req.params.id })

        const trackDetails = await Track.find({ trackID: { $in: (course.courseTracks.map(track => track.trackID)) } }).select('-_id price trackID trackName')
        if (!course) return res.send({ result: false, message: 'not found the course' });
        res.send({ result: true, tracks: trackDetails });
    } catch (err) {
        next(err);
    }
});

router.get('/coursesName', auth , async (req, res, next) => {
    try {
        let course = await Course.find().select('courseID courseName priceAfterDiscount')
        const trackDetails = await Track.find({ trackID: { $in: (course.courseTracks.map(track => track.trackID)) } })
        if (!course) return res.send({ result: false, message: 'not found the course' });
        res.send({ result: true, data: course, tracks: trackDetails });
    } catch (err) {
        next(err);
    }
});
 
 
router.post('/findByStudent', auth , async (req, res, next) => {
    try {
      const students = await AssignStudent.find({ studentID: req.body.studentID }).sort('groupID').select('-_id -__v');
      let coursesID= students.map(item=>item.courseID)
      let groupssID= students.map(item=>item.groupID)
      let courses= await Course.find({courseID: { $in:coursesID} })
      let groups= await Group.find({groupID: { $in:groupssID} })
      res.send({result:true,data:courses,groups:groups});
    } catch (err) {
      next(err);
    }
  }); 


router.post('/',auth , async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const providerID = await Provider.findOne({ providerID: req.body.providerID });
        if (!providerID) return res.send({ result: false, message: 'the providerID is not exist' });

        let courseName = await Course.findOne({ courseName: req.body.courseName });
        if (courseName) return res.send({ result: false, message: 'this course is already exist' });


        let course = new Course(
            {
                employeeID: req.body.employeeID,
                providerID: req.body.providerID,
                courseName: req.body.courseName,
                courseTracks: req.body.courseTracks,
                courseDesc: req.body.courseDesc,
                discount: req.body.discount,
                coursePrice: req.body.coursePrice,
                courseHours: req.body.courseHours,
                priceAfterDiscount: req.body.priceAfterDiscount
            }
        );

        if (!course) return res.send({ result: false, message: 'error in the DB' });
        await course.save();
        res.send({ result: true, data: course });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', auth , async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

        const providerID = await Provider.findOne({ providerID: req.body.providerID });
        if (!providerID) return res.send({ result: false, message: 'the providerID is not exist' });



        let updateCourse = await Course.findOneAndUpdate({ courseID: req.params.id },
            _.pick(req.body,
                [
                    'employeeID',
                    'providerID',
                    'courseName',
                    'courseTracks',
                    'courseDesc',
                    'discount',
                    'coursePrice',
                    'courseHours',
                    'priceAfterDiscount'
                ]), { new: true, runValidators: true, context: 'query' });


        if (!updateCourse) return res.send({ result: false, message: 'error in DB' });

        res.send({ result: true, data: updateCourse });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
