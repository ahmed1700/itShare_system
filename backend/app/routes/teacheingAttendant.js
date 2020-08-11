const router = require('express').Router();
const { TeacheingAttendant, validate } = require('../models/teacheingAttendant');
const { AlternativeAttendant } = require('../models/alternatveAttendance');
const { Group } = require('../models/groups');
const { Branch } = require('../models/branch');
const { getHoursAtt, getHoursOfDay, realTeachedHour, getHoursOfDayUpdate } = require('../Functions/get-Hour-Of-Day');
const { Track } = require('../models/tracks');
const { AssignStudent } = require('../models/assignStudent');
const { Student } = require('../models/students');
const { studentAttendant } = require('../models/studentAttendant');
const auth = require('../middleware/userAuthorization');


router.get('/',auth, async (req, res) => {
    const Attendance = await TeacheingAttendant.find();
    res.send({ result: true, data: Attendance });
})


router.get('/:id', auth, async (req, res) => {
    const Attendance = await TeacheingAttendant.findOne({ teacheingAttendantID: req.params.id });
    res.send({ result: true, data: Attendance });
})
//   هنا الجزء المسؤول عن حضور الطلبه بيجيبلي كل الطلبه اللي لسه محضرتش النهارده 
router.post('/studentAttendant',auth, async (req, res) => {
     
    let StudentAttendant = await AssignStudent.find({
        groupID: req.body.groupID,
    }).select('assignStudentID studentID');

    let assignStudentIDs = StudentAttendant.map(s => s.assignStudentID);
    let studentAlreadyAttendant = await studentAttendant.find({ assignStudentID: { $in: assignStudentIDs }, date: { $gte: new Date().setHours(00, 00, 00), $lte: new Date().setHours(23, 59, 59) } })

    let selectedStudent = studentAlreadyAttendant.map(s => s.assignStudentID)
    StudentAttendant = StudentAttendant.filter(s => !selectedStudent.includes(s.assignStudentID))

    let studentIDs = StudentAttendant.map(s => s.studentID);
    let students = await Student.find({ studentID: { $in: studentIDs } }).select('studentID fullNameEnglish');

    if (!studentAttendant) { return res.send({ result: false, message: 'the groupID is not correct' }) }
    res.send({ result: true, data: StudentAttendant, students: students })
})

router.post('/trainerAttendant',auth, async (req, res) => {
    let trainerAttendant = await TeacheingAttendant.find({
        trainerID: req.body.trainerID,
        groupID: req.body.groupID,

    });
    if (!trainerAttendant) { return res.send({ result: false, message: 'the groupID is not correct' }) }
    res.send({ result: true, data: trainerAttendant })
})


router.post('/adminAttendant', auth, async (req, res) => {
    let trainerAttendant = await TeacheingAttendant.find({
        trainerID: req.body.trainerID,
        groupID: req.body.groupID,
        trackID: req.body.trackID,

    });
    if (!trainerAttendant) { return res.send({ result: false, message: 'the groupID is not correct' }) }
    res.send({ result: true, data: trainerAttendant })
})



router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.send({ result: false, message: error.details[0].message });

    const group = await Group.findOne({ groupID: req.body.groupID });
    if (!group) { return res.send({ result: false, message: 'the groupID is not correct' }) }

    if (group.groupStatus != 'working') return res.send({ result: false, message: `this group is${groupStatus}` });

    let trackHistory;
    let signin = new Date();
   
        // ده كده دخلت جوه الجروب وجبت التراكات اللي فيها المدرب ده بيدي الكورس ده 
        let groupTracks = group.groupTracks.find(t => t.trainerID === req.body.trainerID && t.trackID === req.body.trackID);
        if (!groupTracks) {
            return res.send({ result: false, message: 'this track is not correct' });
        } else {
            trackHistory = groupTracks.trackHistory;
            if (trackHistory.filter(g => new Date(g).toDateString() === new Date(signin).toDateString()).length == 0) {
                return res.send({ result: false, message: 'this track is not today' });
            }
            if (groupTracks.trackStatus == 'completed') {
                return res.send({ result: false, message: 'this track is completed' });
            }
        }

    let { ip } = req.body
    let branchID = group.branchID
    let branch = await Branch.findOne({ branchID: branchID });
    if (ip !== branch.ip && ip !== branch.ip2 && ip !== branch.ip3) {
        return res.send({ result: false, message: 'Something wrong please sign in from branch' })
    }


    let totalTeachedHours = 0;
    let totalHours // all attendant for this trainer and this track
    totalHours = await TeacheingAttendant.find({
        trainerID: req.body.trainerID,
        groupID: req.body.groupID, trackID: req.body.trackID
    });


    if (totalHours && totalHours.length > 0) {
        totalTeachedHours = totalHours.reduce((a, b) => +a + +b.actualTeachedHours, 0);
        if (!totalTeachedHours) return res.send({ result: false, message: 'Something wrong please go to admin to check if you sign out last lecture' })
    } else if (totalHours && totalHours.length == 0) { totalTeachedHours = 0; }
    else { return res.send({ result: false, message: 'Something wrong please go to admin to check if you sign out last lecture' }) };//this error happen when the trainer sign in and not signed out}



    let teacheingAttendant = new TeacheingAttendant(
        {
            'groupID': req.body.groupID,
            'trainerID': req.body.trainerID,
            'trackID': req.body.trackID,
            'ip': req.body.ip,

        }
    )

    teacheingAttendant.signin = signin.getHours() + ':' + signin.getMinutes();
    await teacheingAttendant.save();
    return res.send({ result: true, data: teacheingAttendant });

});


router.put('/:id',auth, async (req, res) => {

    let { signin, groupID, trainerID, trackID, signOut } = await TeacheingAttendant.findOne({ teacheingAttendantID: req.params.id });

    if (signOut) {
        return res.send({ result: false, message: 'You signOut before' })
    }

    const group = await Group.findOne({ groupID: groupID });

    let { ip } = req.body
    let branchID = group.branchID
    let branch = await Branch.findOne({ branchID: branchID });

    if (ip !== branch.ip && ip !== branch.ip2 && ip !== branch.ip3) {
        return res.send({ result: false, message: 'Something wrong please go to admin' })
    }


    let updateTeacheingAttendant = await TeacheingAttendant.findOneAndUpdate({ teacheingAttendantID: req.params.id },
        {

            'signin': signin,
            'trainerID': trainerID,
            'groupID': groupID,
            'trackID': trackID,
            'ip': req.body.ip,
        }, { new: true, runValidators: true });

    let signout = new Date();
    updateTeacheingAttendant.signOut = signout.getHours() + ':' + signout.getMinutes();

    const { groupSchedule } = await Group.findOne({ groupID: groupID });
    if (!groupSchedule) { return res.send({ result: false, message: 'the groupID is not correct' }) }
    // هنا بجيب عدد ساعات الكورس اللي في الجدول الاساسي بتاع الجروب
    const cHour = getHoursOfDay(groupSchedule);

    let HourFrom = cHour.dHourfrom
    let HourTo = cHour.dHourto
    //   هنا بحسب الوقت اللي هيتحسب للمدرب لو دخل بدري عن معاده مش هيتحسب ولو خرج بعد معاده مش هيتحسب 
    const totalhoursofday = getHoursAtt(updateTeacheingAttendant.signOut, signin, HourFrom, HourTo);
    // هنا بحسب الوقت اللي هيحسب للطلبه
    let realTeachedHours = realTeachedHour(updateTeacheingAttendant.signOut, signin)


    if (cHour.groupActualHours <= totalhoursofday) {
        updateTeacheingAttendant.actualTeachedHours = cHour.groupActualHours;
    } else {
        updateTeacheingAttendant.actualTeachedHours = totalhoursofday;
    }


    let totalTeachedHoursByTrack = 0;
    let totalHours // all attendant for this trainer and this track

    totalHours = await TeacheingAttendant.find({
        trainerID: trainerID,
        groupID: groupID, trackID: trackID
    });


    if (totalHours && totalHours.length > 0) {

        totalTeachedHoursByTrack = totalHours.reduce((a, b) => +a + +(b.actualTeachedHours || 0), 0);
        let trainerTotalTeachedHoursByTrack = totalTeachedHoursByTrack + updateTeacheingAttendant.actualTeachedHours

        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
            { $set: { 'groupTracks.$.trainerTotalTeachedHours': trainerTotalTeachedHoursByTrack } }
        );

        let totalTeachedHoursForCurrentTrack = totalHours.reduce((a, b) => +a + +(b.totalTeachedHours || 0), 0);
        updateTeacheingAttendant.totalTeachedHours = totalTeachedHoursForCurrentTrack + +realTeachedHours

        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
            { $set: { 'groupTracks.$.totalTeachedHours': updateTeacheingAttendant.totalTeachedHours } }
        );

        let track = await Track.findOne({ trackID: trackID });

        if (updateTeacheingAttendant.totalTeachedHours >= track.trackHours) {
            await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
                { $set: { 'groupTracks.$.trackStatus': 'completed' } }

            )

        } else {
            await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
                { $set: { 'groupTracks.$.trackStatus': 'working' } }

            )
        }

    }
    if (!updateTeacheingAttendant) return res.send({ result: false, message: 'error in DB' });

    await updateTeacheingAttendant.save();
    res.send({ result: true, data: updateTeacheingAttendant });
});

router.put('/admin/:id', auth, async (req, res) => {

    let { groupID, trainerID, trackID, date, actualTeachedHours ,totalTeachedHours } = await TeacheingAttendant.findOne({ teacheingAttendantID: req.params.id });

     console.log('actualTeachedHours',actualTeachedHours)
    let updateTeacheingAttendant = await TeacheingAttendant.findOneAndUpdate({ teacheingAttendantID: req.params.id },
        {
            'signin': req.body.signin,
            'trainerID': trainerID,
            'groupID': groupID,
            'trackID': trackID,
            'signOut': req.body.signOut,
            'actualTeachedHours': req.body.actualTeachedHours

        }, { new: true, runValidators: true });


    let { signOut, signin } = req.body;
    let cHour

    const { groupSchedule } = await Group.findOne({ groupID: groupID });
    if (!groupSchedule) { return res.send({ result: false, message: 'the groupID is not correct' }) }

    cHour = getHoursOfDayUpdate(date, groupSchedule);
    let totalhoursofday
    if (cHour == 0) {
        
            alternativeAttendant = await AlternativeAttendant.find({
                trainerID: trainerID,
                groupID: groupID, trackID: trackID 
            });

            if (alternativeAttendant && alternativeAttendant.length > 0) {
                let today = alternativeAttendant.filter(p => new Date(p.date).toDateString() === date.toDateString());
                cHour = realTeachedHour(today[0].HourTo, today[0].HourFrom)
                const resulltHourfrom = today[0].HourFrom.split(":");
                var dHourfrom = new Date('', '', '', resulltHourfrom[0], resulltHourfrom[1]);
                let resultHourTo = today[0].HourTo.split(":");
                let dHourHourTo = new Date('', '', '', resultHourTo[0], resultHourTo[1]);
                totalhoursofday = getHoursAtt(signOut, signin, dHourfrom,dHourHourTo);
            }
        

    } else {
        cHour = cHour
        let HourFrom = cHour.dHourfrom
        let HourTo = cHour.dHourto
        totalhoursofday = getHoursAtt(signOut, signin, HourFrom, HourTo);
    }

    if (!req.body.actualTeachedHours || actualTeachedHours == null) {
        if (cHour.groupActualHours) {
            if (cHour.groupActualHours <= totalhoursofday) {
                updateTeacheingAttendant.actualTeachedHours = cHour.groupActualHours;
            } else {
                updateTeacheingAttendant.actualTeachedHours = totalhoursofday;
            }
        } else {
            if (cHour <= totalhoursofday) {
                updateTeacheingAttendant.actualTeachedHours = cHour;
            } else {
                updateTeacheingAttendant.actualTeachedHours = totalhoursofday;
            }
        }

    }
    let totalTeachedHoursByTrack = 0;
    let totalHours

    totalHours = await TeacheingAttendant.find({
        trainerID: trainerID,
        groupID: groupID, trackID: trackID
    });

    if (totalHours) {
        let trainerTotalTeachedHoursByTrack=0
        totalTeachedHoursByTrack = totalHours.reduce((a, b) => +a + +(b.actualTeachedHours || 0), 0);
         if(actualTeachedHours&&actualTeachedHours!=null){    
            trainerTotalTeachedHoursByTrack = totalTeachedHoursByTrack 
         }else{
            trainerTotalTeachedHoursByTrack = totalTeachedHoursByTrack + updateTeacheingAttendant.actualTeachedHours
         }
       
        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
            { $set: { 'groupTracks.$.trainerTotalTeachedHours': trainerTotalTeachedHoursByTrack } }
        );
        let realTeachedHours = realTeachedHour(updateTeacheingAttendant.signOut, signin)
        let totalTeachedHoursForCurrentTrack = totalHours.reduce((a, b) => +a + +(b.totalTeachedHours || 0), 0);
        if(actualTeachedHours&&actualTeachedHours!=null){
            updateTeacheingAttendant.totalTeachedHours = totalTeachedHoursForCurrentTrack 
        }else{
            updateTeacheingAttendant.totalTeachedHours = +totalTeachedHoursForCurrentTrack + +realTeachedHours  
        }
        
        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
            { $set: { 'groupTracks.$.totalTeachedHours': updateTeacheingAttendant.totalTeachedHours } }
        );

       

        let track = await Track.findOne({ trackID: trackID });

        if (updateTeacheingAttendant.totalTeachedHours >= track.trackHours) {
            await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
                { $set: { 'groupTracks.$.trackStatus': 'completed' } }

            )

        } else {
            await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
                { $set: { 'groupTracks.$.trackStatus': 'working' } }

            )
        }

    }

    if (!updateTeacheingAttendant) return res.send({ result: false, message: 'error in DB' });

    await updateTeacheingAttendant.save();
    res.send({ result: true, data: updateTeacheingAttendant });
});

module.exports = router;