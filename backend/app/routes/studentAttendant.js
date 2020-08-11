const router = require('express').Router();
const _ = require('lodash');
const { AssignStudent } = require('../models/assignStudent');
const { studentAttendant, validate } = require('../models/studentAttendant');
const { Group } = require('../models/groups');
const { Track } = require('../models/tracks');
const auth = require('../middleware/userAuthorization');

router.get('/:id', auth ,async (req, res) => {
    const Attendance = await studentAttendant.find({ assignStudentID: req.params.id });
      const groupsId=  Attendance.map(g=>g.groupID);
      let groups = await Group.find({ groupID: { $in: groupsId} }).select('groupID groupName -_id');

     
      const tracksId=  Attendance.map(g=>g.trackID);
      let tracks = await Track.find({ trackID: { $in: tracksId} }).select('trackID trackName -_id');

    if (!Attendance) return res.send({ result: false, message: `There  is no attendant for this student` })
    res.send({ result: true, data: Attendance ,groups:groups ,tracks:tracks});
}) 
 
 
router.post('/', auth , async (req, res) => {  
    let assignStudentIDs = req.body.map(s=>s.assignStudentID);
     await AssignStudent.update({ assignStudentID: { $in: assignStudentIDs }},{attend:true},{ multi: true })
    const insertMany = await studentAttendant.insertMany(req.body, { multi: true });
    return res.send({ result: true, data: insertMany });
});


module.exports = router;