const router = require('express').Router();
const _ = require('lodash');
const { AssignStudent, validate } = require('../models/assignStudent');
const { Payment } = require('../models/payments');
const { Employee } = require('../models/employees');
const { Student } = require('../models/students');
const { Group } = require('../models/groups');
const { Course } = require('../models/courses');
const { Track } = require('../models/tracks');
const { Branch } = require('../models/branch');
const auth = require('../middleware/userAuthorization');




router.get('/',auth, async (req, res, next) => {
    try {
        const assignStudent = await AssignStudent.find().sort({'assignStudentID':-1});
        if (!assignStudent) return res.send({ result: false, message: 'Something Error' });
        res.send({ result: true, data: assignStudent });
    } catch (err) {
        next(err);
    }
});


router.get('/:id',auth, async (req, res, next) => {
    try {
        const assignStudent = await AssignStudent.findOne({ assignStudentID: req.params.id });
        if (!assignStudent) return res.send({ result: false, message: 'not found the student' });
        res.send({ result: true, data: assignStudent });
    } catch (err) {
        next(err);
    }
});
// هنا بخليه يجيبلي معلومات التسجيل لطالب من خلال ال اي دي بتاعه
router.post('/assign', auth, async (req, res, next) => {
    try {
        const assignStudent = await AssignStudent.find({ studentID: req.body.studentID });
        // get assign cousrses data
        let coursesID = assignStudent.map(course => course.courseID);
        let courses = await Course.find({ courseID: { $in: coursesID } }).select('courseID courseName -_id');
  
        // get assign cousrses data
        let groupsID = assignStudent.map(group => group.groupID);
        let groups = await Group.find({ groupID: { $in: groupsID } }).select('groupID groupName -_id');

        if (!assignStudent) return res.send({ result: false, message: 'not found the student' });
        res.send({ result: true, data: assignStudent, courses: courses, groups: groups });
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });
        //اتاكدت ان الطالب موجود
        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });
        //اتاكد ان الفرع مظبوط
        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });

        // اتاكدت ان الكورس اللي انا مدخلاه موجود 
        const courseID = await Course.findOne({ courseID: req.body.courseID });
        if (!courseID) return res.send({ result: false, message: 'the courseID is not correct' });
        let { groupID } = req.body;

        let group;
        //في حالة اذا دخلت الجروب اتاكدت انه موجود
        if (req.body.groupID != null) {
            group = await Group.findOne({ groupID: req.body.groupID });
            if (!group) return res.send({ result: false, message: 'the groupID is not correct' });

        }


        //اتاكدت ان الطالب متسجلش قبل كده  المشكله ان لو هو سجل في كورس تاني فبالتالي 
        const assignStudentID = await AssignStudent.findOne({ studentID: req.body.studentID, courseID: req.body.courseID });
        if (assignStudentID) {
            if (assignStudentID.groupID == null)
                return res.send({ result: false, message: 'the student is assigned before to this course' });
        }
        if (assignStudentID && groupID != null) {
            if (assignStudentID.groupID == groupID) {
                return res.send({ result: false, message: 'the student is assigned before to this course' });
            }
        }


        const { priceAfterDiscount } = await Course.findOne({ courseID: req.body.courseID });
        if (!priceAfterDiscount) return res.send({ result: false, message: 'the coursePrice is not correct' });

        // هنا هجيب التراكات اللي جوه الكورس اللي انا مدخلاه
        let tracks = courseID.courseTracks;
        let { courseTracks } = req.body;
        let tracksArray = [];
        //وحطيت الايديهات بتاعتهم جوه اراي
        let courseTracksArray = [];
        if (tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i].trackID
                courseTracksArray.push(track)
            }
        }
        // واجيب تراكات الكورس اللي انا مدخلاها علشان اتاكد ان هم موجودين جوه تراكات الكورس


        // لو مدخلش التراكات هو هيدخل كل تراكات الكورس
        if (courseTracks != null) {
            if (courseTracks.length > 0) {
                for (let i = 0; i < courseTracks.length; i++) {

                    let track = await Track.findOne({ trackID: req.body.courseTracks[i].trackID })
                    if (!track) return res.send({ result: false, message: 'the trackID is not correct' });
                    else { tracksArray.push(track.trackID) }
                }
                if (!tracksArray.every(element => courseTracksArray.includes(element))) {
                    return res.send({ result: false, message: 'the trackID is not exist in this course' })
                }
            }
        }
        let assignStudent = new AssignStudent(
            _.pick(req.body,
                ['branchID',
                    'employeeID',
                    'studentID',
                    'groupID',
                    'courseID',
                    'courseTracks',
                    'totalPayment',

                ]));


        if (group) {
            if (group.groupStatus == 'pending') {
                assignStudent.status = 'waiting'
            } else {
                assignStudent.status = 'working'
            }
 
        } else {
            assignStudent.status = 'waiting'
        }

        let student = await Student.findOneAndUpdate({ studentID: req.body.studentID }, {
            isAssign: true
        });

        if (!assignStudent) return res.send({ result: false, message: 'error in DB' });

        await assignStudent.save();
        res.send({ result: true, data: assignStudent });
    } catch (err) {
        next(err);
    }
});

router.put('/:id',auth, async (req, res, next) => {

    try {


        let assignStudent = await AssignStudent.findOne({ assignStudentID: req.params.id });
        if (!assignStudent) return res.send({ result: false, message: 'not found the student' });

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        let group
        //في حالة اذا دخلت الجروب اتاكدت انه موجود
        if (req.body.groupID) {
            group = await Group.findOne({ groupID: req.body.groupID });
            if (!group) return res.send({ result: false, message: 'the groupID is not correct' });

        }


        const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
        if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });
        //اتاكدت ان الطالب موجود
        const studentID = await Student.findOne({ studentID: req.body.studentID });
        if (!studentID) return res.send({ result: false, message: 'the studentID is not correct' });
        //اتاكد ان الفرع مظبوط
        let branchID = await Branch.findOne({ branchID: req.body.branchID });
        if (!branchID) return res.send({ result: false, message: 'the branch is not exist' });

        // اتاكدت ان الكورس اللي انا مدخلاه موجود 
        const course = await Course.findOne({ courseID: req.body.courseID });
        if (!course) return res.send({ result: false, message: 'the courseID is not correct' });




        const { priceAfterDiscount } = await Course.findOne({ courseID: req.body.courseID });
        if (!priceAfterDiscount) return res.send({ result: false, message: 'the coursePrice is not correct' });

        // هنا هجيب التراكات اللي جوه الكورس اللي انا مدخلاه
        let tracks = course.courseTracks
        //وحطيت الايديهات بتاعتهم جوه اراي
        let courseTracksArray = [];
        if (tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i].trackID
                courseTracksArray.push(track)
            }
        }
        // واجيب تراكات الكورس اللي انا مدخلاها علشان اتاكد ان هم موجودين جوه تراكات الكورس
        let tracksArray = [];
        let { courseTracks } = req.body;
        // لو مدخلش التراكات هو هيدخل كل تراكات الكورس
        if (courseTracks != null) {
            if (courseTracks.length > 0) {
                for (let i = 0; i < courseTracks.length; i++) {

                    let track = await Track.findOne({ trackID: req.body.courseTracks[i].trackID })
                    if (!track) return res.send({ result: false, message: 'the trackID is not correct' });
                    else { tracksArray.push(track.trackID) }
                }
                if (!tracksArray.every(element => courseTracksArray.includes(element))) {
                    return res.send({ result: false, message: 'the trackID is not exist in this course' })
                }

            }

        }

        let { groupID, courseID, totalPayment } = req.body;
        //اتاكدت ان الطالب متسجلش قبل كده  المشكله ان لو هو سجل في كورس تاني فبالتالي 
        if (assignStudent.courseID != courseID) {

            let payment = await Payment.find({ assignStudentID: req.params.id, courseID: assignStudent.courseID });
            if (payment.length > 0) return res.send({ result: false, message: 'You can not update ,please transfer' });

        }

        if (totalPayment != assignStudent.courseID.totalPayment) {
            const inpayments = await Payment.find({ assignStudentID: req.params.id, tranactionType: 'in' });

            let inpaid = 0;
            if (inpayments) {
                for (const p of inpayments) { inpaid += p.paid; }
            }

            const outpayments = await Payment.find({ assignStudentID: req.params.id, tranactionType: 'out' });
            let outpaid = 0;
            if (outpayments)
            // get remaing from payment Hestory
            {
                for (const p of outpayments) { outpaid += p.paid; }
            }
            let remaingPayment = inpaid - outpaid;

            if (totalPayment < remaingPayment) {

                return res.send({ result: false, message: `The TotalPayment is More Than Paid` });

            }
        }

        let status
        if (req.body.groupID) {
            if (group.groupStatus == 'pending') {
                status = 'waiting'
            } else {
                status = 'working'
            }
        } else {
            status = 'waiting'
        }

        let updateassignStudent = await AssignStudent.findOneAndUpdate({ assignStudentID: req.params.id },
            {
                'branchID': req.body.branchID,
                'employeeID': req.body.employeeID,
                'studentID': req.body.studentID,
                'groupID': req.body.groupID,
                'courseID': req.body.courseID,
                'courseTracks': req.body.courseTracks,
                'totalPayment': req.body.totalPayment,
                status: status

            },
            { new: true, runValidators: true });


        if (req.body.groupID) {
            console.log(group)
            if (group.groupStatus == 'pending') {
                updateassignStudent.status = 'waiting'
            } else {
                updateassignStudent.status = 'working'
            }
        }

        if (!updateassignStudent) return res.send({ result: false, message: 'error in DB' });

        res.send({ result: true, data: updateassignStudent });
    } catch (err) {
        next(err);
    }
});



router.put('/removeGroup/:id', auth, async (req, res, next) => {
    try {
        const assignStudent = await AssignStudent.findOneAndUpdate({ assignStudentID: req.params.id }, {
            $unset: { groupID: '' },
            status: 'pending'
        });
        if (!assignStudent) return res.send({ result: false, message: 'not found the student' });
        res.send(true);
    } catch (err) {
        next(err);
    }
});

module.exports = router;