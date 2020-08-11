const router = require('express').Router();
const { Branch } = require('../models/branch');
const { Track } = require('../models/tracks');
const { TeacheingAttendant } = require('../models/teacheingAttendant');
const { Group } = require('../models/groups');
const { AlternativeAttendant } = require('../models/alternatveAttendance');
const { getHoursAtt, realTeachedHour } = require('../Functions/get-Hour-Of-Day');
const auth = require('../middleware/userAuthorization');
router.post('/', auth,async (req, res) => {

    const group = await Group.findOne({ groupID: req.body.groupID });
    if (group.groupTracks && group.groupTracks.length > 0) {
        // ده كده دخلت جوه الجروب وجبت التراكات اللي فيها المدرب ده بيدي الكورس ده 
        let groupTracks = group.groupTracks.find(t => t.trainerID === req.body.trainerID && t.trackID === req.body.trackID);
        if (!groupTracks) {
            return res.send({ result: false, message: 'this track is not correct' });
        } else {
            if(groupTracks.trackStatus=='completed'){
                return res.send({ result: false, message: 'this track is finished' });
            }
        }

    }
    let signin = new Date();
    let totalTeachedHours = 0;
    let totalHours // all attendant for this trainer and this track
    let alternatveAttendance

    alternatveAttendance = await AlternativeAttendant.find({
        trainerID: req.body.trainerID,
        groupID: req.body.groupID, trackID: req.body.trackID
    });
    if (!alternatveAttendance) return res.send({ result: false, message: 'this group is not today' });


    let { ip } = req.body
    let branchID = group.branchID
    let branch = await Branch.findOne({ branchID: branchID });
    if (ip !== branch.ip && ip !== branch.ip2 && ip !== branch.ip3) {
        return res.send({ result: false, message: 'Something wrong please go to admin' })
    }


    totalHours = await TeacheingAttendant.find({
        trainerID: req.body.trainerID,
        groupID: req.body.groupID, trackID: req.body.trackID
    });



    if (totalHours && totalHours.length > 0) {
        totalTeachedHours = totalHours.reduce((a, b) => +a + +b.actualTeachedHours, 0);
        if (!totalTeachedHours) return res.send({ result: false, message: 'Something wrong please go to admin to check if you sign out the last lecture' })
    } else if (totalHours && totalHours.length == 0) { totalTeachedHours = 0; }
    else { return res.send({ result: false, message: 'Something wrong please go to admin to check if you sign out the last lecture' }) };//this error happen when the trainer sign in and not signed out}


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
router.put('/:id', auth, async (req, res) => {

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


    let cHour
    let alternativeAttendant


    alternativeAttendant = await AlternativeAttendant.find({
        trainerID: trainerID,
        groupID: groupID, trackID: trackID 
    });
     console.log('alternativeAttendant',alternativeAttendant)
    let today = alternativeAttendant.filter(p => new Date(p.date).toDateString() === new Date().toDateString());
        cHour = realTeachedHour(today[0].HourTo, today[0].HourFrom)

    
      let HourFrom = today[0].HourFrom.split(":");
        HourFrom  = new Date('', '', '', HourFrom [0], HourFrom [1]);
        let HourTo = today[0].HourTo.split(":");
        HourTo  = new Date('', '', '', HourFrom [0], HourFrom [1]);
    const totalhoursofday = getHoursAtt(updateTeacheingAttendant.signOut, signin,HourFrom ,HourTo);


    if (cHour <= totalhoursofday) {
        updateTeacheingAttendant.actualTeachedHours = cHour;
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
        //total teached hour for trainer 
        totalTeachedHoursByTrack = totalHours.reduce((a, b) => +a + +(b.actualTeachedHours || 0), 0);
        let trainerTotalTeachedHoursByTrack = totalTeachedHoursByTrack + updateTeacheingAttendant.actualTeachedHours
        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
            { $set: { 'groupTracks.$.trainerTotalTeachedHours': trainerTotalTeachedHoursByTrack } }
        );

        //total teached hour for track 
        let realTeachedHours = realTeachedHour(updateTeacheingAttendant.signOut, signin)
        let totalTeachedHoursForCurrentTrack = totalHours.reduce((a, b) => +a + +(b.totalTeachedHours || 0), 0);
        updateTeacheingAttendant.totalTeachedHours = +totalTeachedHoursForCurrentTrack + +realTeachedHours
         console.log('ll',totalTeachedHoursForCurrentTrack + realTeachedHours)
        await Group.findOneAndUpdate({ groupID: groupID, 'groupTracks': { $elemMatch: { trainerID: trainerID, trackID: trackID } } },
          { $set:{ 'groupTracks.$.totalTeachedHours': updateTeacheingAttendant.totalTeachedHours}} 
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