const router = require('express').Router();
const _ = require('lodash');
const { Group, validate } = require('../models/groups');
const { AssignStudent } = require('../models/assignStudent');
const { Employee } = require('../models/employees');
const { Course } = require('../models/courses'); 
const { Branch } = require('../models/branch');
const { Student } = require('../models/students');
const { Vacation } = require('../models/vacations');
const { AlternativeAttendant } = require('../models/alternatveAttendance');
const { TeacheingAttendant } = require('../models/teacheingAttendant');
const moment = require('moment');
const auth = require('../middleware/userAuthorization');

router.get('/', auth, async (req, res, next) => {
  try {
    const groups = await Group.find().sort({'groupID':-1}).select('-_id -__v');
    res.send({ result: true, data: groups });
  } catch (err) {
    next(err);
  } 
}); 
 
router.get('/trainerpay', auth, async (req, res, next) => {
  try {
    let groups = await Group.find({'groupTracks': { $elemMatch: { trackStatus: 'completed',isPaid: false } }}).sort('groupID').select('groupTracks groupID groupName  branchID');
    for(let i=0;i<groups.length;i++){    
      groups[i].groupTracks=  groups[i].groupTracks.filter(track=>(track.trackStatus==='completed'&&track.isPaid===false))
      }
    res.send({ result: true, data: groups });
  } catch (err) {
    next(err);
  }
});

router.post('/trainerPayment',auth, async (req, res, next) => {
  try {
    let groups = await Group.find({'groupTracks': { $elemMatch: { trackStatus: 'completed',isPaid: false ,trainerID:req.body.trainerID} }}).sort('groupID').select('groupTracks groupID groupName  branchID');
    for(let i=0;i<groups.length;i++){    
      groups[i].groupTracks=  groups[i].groupTracks.filter(track=>(track.trackStatus==='completed'&&track.isPaid===false&&track.trainerID===req.body.trainerID))
      }
    res.send({ result: true, data: groups });
  } catch (err) {
    next(err);
  }
}); 




      //get all working groups
router.get('/workingGroups', auth, async (req, res, next) => {
  try {
    const groups = await Group.find({ groupStatus: 'working' }).sort('groupID').select('-_id -__v');
    res.send({ result: true, data: groups });
  } catch (err) {
    next(err);
  }
});



      //get all working groups by branch
      router.post('/workingGroupsByBranch', auth, async (req, res, next) => {
        try {
          const groups = await Group.find({ groupStatus: 'working',branchID:req.body.branchID }).sort('groupID').select('-_id -__v');
          res.send({ result: true, data: groups });
        } catch (err) {
          next(err);
        }
      });


     //get all working and pending groups
     router.get('/activegroups',auth, async (req, res, next) => {
      try {
        const workingGroups = await Group.find({ groupStatus:'working' }).sort('groupID').select('groupID groupName -_id');
        const pendingGroups = await Group.find({ groupStatus:'pending' }).sort('groupID').select('groupID groupName -_id');
        const waitingGroups = await Group.find({ groupStatus:'waiting' }).sort('groupID').select('groupID groupName -_id');
        let data=  workingGroups.concat(pendingGroups)
        data.concat(waitingGroups)
        res.send({ result: true, data: data });
      } catch (err) {
        next(err);
      }
    });

 //get all groups for aspecific course
 // ده كنت هستخدمه في حالة اذا كنت هخلي الطالب يعمل  علي الجروب اللي بيدي الكورس بتاعه بس 
router.post('/findByCourse',auth, async (req, res, next) => {
  try {
    const groups = await Group.find({ courseID: req.body.courseID }).sort('groupID').select('-_id -__v');
    res.send(groups);
  } catch (err) {
    next(err);
  }
});
// get all groups for the trainer
router.post('/trainer', auth, async (req, res, next) => {
  try {
    let groupTrack = await Group.find({groupStatus:'working' ,'groupTracks': { $elemMatch: { trainerID: req.body.trainerID } }, }).sort('groupID').select('-_id -__v');
   
      for(let i=0;i<groupTrack.length;i++){     
      groupTrack[i].groupTracks=  groupTrack[i].groupTracks.filter(track=>track.trainerID===req.body.trainerID)
      } 
       
    res.send({trainerGroups:groupTrack});
  
  } catch (err) {
    next(err);
  } 
});
// get all groups for the trainer
router.post('/trainertoday',auth, async (req, res, next) => {
  try {
    let groupTrack = await Group.find({groupStatus:'working' ,'groupTracks': { $elemMatch: { trainerID: req.body.trainerID } }, }).sort('groupID').select('-_id -__v');
    groupTrack= groupTrack.filter(g=>g.cousreHistory.some(d=>new Date(d).toDateString()===new Date().toDateString()))
      
      for(let i=0;i<groupTrack.length;i++){    
      groupTrack[i].groupTracks=  groupTrack[i].groupTracks.filter(track=>track.trainerID===req.body.trainerID&&track.trackHistory.some(d=>new Date(d).toDateString()===new Date().toDateString()))
      }

      groupTrack=groupTrack.filter(g=>g.groupTracks.length!=0)

      let alternative = await AlternativeAttendant.find({trainerID: req.body.trainerID})
      alternative= alternative.filter(d=>new Date(d.date).toDateString()===new Date().toDateString())

      let todatAttendant = await TeacheingAttendant.find({trainerID: req.body.trainerID})
      todatAttendant= todatAttendant.filter(d=>new Date(d.date).toDateString()===new Date().toDateString())
    
    res.send({trainerGroups:groupTrack,alternative:alternative,todatAttendant,todatAttendant });
  
  } catch (err) {
    next(err);
  }    
});  
 
router.get('/:id', auth, async (req, res, next) => {
  try {
    const group = await Group.findOne({ groupID: req.params.id });
    const assignStudents = await AssignStudent.find({ groupID: req.params.id })
    let assignStudentIDs = assignStudents.map(s=>s.studentID);
    let students = await Student.find({studentID:{$in:assignStudentIDs}}).select('studentID fullNameEnglish')
    if (!group) return res.send({ result: false, message: 'not found the group -_id' });
    res.send({ result: true, group: group, assignStudents: assignStudents ,students:students});
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

    const branchID = await Branch.findOne({ branchID: req.body.branchID });
    if (!branchID) return res.send({ result: false, message: 'the branchID is not correct' });


    const CourseID = await Course.findOne({ courseID: req.body.courseID });
    if (!CourseID) return res.send({ result: false, message: 'the courseID is not correct' });

    let { groupSchedule, groupStartDate} = req.body;
    
   // check if start day ia aholiday
    const vacations = await Vacation.findOne({date:req.body.groupStartDate});
    if(vacations) return res.send({ result: false, message: 'Group start day is holiday please enter another day' });
    

    // بقوله لو يوم تاريخ بداية الكورس يوم مش موجود في الجدول قوله اطلع بره
     let date =new Date(groupStartDate);
     weekArray = moment.weekdays();
    var startDateDayName = weekArray[date.getDay()];
   
      let startDay = groupSchedule.find(day=>day.days===startDateDayName) 
       if(!startDay)  return res.send({ result: false, message: 'Start day is not correct' });
    
    let group = new Group(
      {
        'employeeID': req.body.employeeID,
        'branchID': req.body.branchID,
        'groupName': req.body.courseID,
        'courseID': req.body.courseID,
        'groupSchedule': req.body.groupSchedule,
        'groupTracks': req.body.groupTracks,
        'groupStartDate': req.body.groupStartDate,
        'class': req.body.class,
        'groupType': req.body.groupType,
        'groupStatus': req.body.groupStatus,
      }
    );
  
    group = await require('../Functions/group-check-function')(req, res, group);

    if (!group) return res.send({ result: false, message: 'error in the DB' });


    await group.save();
    res.send({ result: true, data: group });
  } catch (err) {
    next(err);
  }
});

// ___________________________________

router.put('/:id', auth, async (req, res, next) => {
 // try {

    const { error } = validate(req.body);
    if (error) return res.send({ result: false, message: error.details[0].message });


    const employeeID = await Employee.findOne({ employeeID: req.body.employeeID });
    if (!employeeID) return res.send({ result: false, message: 'the employeeID is not correct' });

    const branchID = await Branch.findOne({ branchID: req.body.branchID });
    if (!branchID) return res.send({ result: false, message: 'the branchID is not correct' });


    const CourseID = await Course.findOne({ courseID: req.body.courseID });
    if (!CourseID) return res.send({ result: false, message: 'the courseID is not correct' });

    let { groupSchedule, groupStartDate} = req.body;
    
   // check if start day ia aholiday
    const vacations = await Vacation.findOne({date:req.body.groupStartDate});
    if(vacations) return res.send({ result: false, message: 'Group start day is holiday please enter another day' });
    

    // بقوله لو يوم تاريخ بداية الكورس يوم مش موجود في الجدول قوله اطلع بره
     let date =new Date(groupStartDate);
     weekArray = moment.weekdays();
    var startDateDayName = weekArray[date.getDay()];
   
      let startDay = groupSchedule.find(day=>day.days===startDateDayName) 
       if(!startDay)  return res.send({ result: false, message: 'Start day is not correct' });

    let updateGroup = await Group.findOneAndUpdate({ groupID: req.params.id },
      _.pick(req.body, [
        'employeeID',
        'courseID',
        'branchID',
        'groupSchedule',
        'groupTracks',
        'groupStartDate',
        'class',
        'groupType',
        'groupStatus',

      ]), { new: true, runValidators: true, });
        
        let status;

        if (req.body.groupStatus == 'pending') {
            status = 'pending'
        } else if(req.body.groupStatus == 'working') {
             status = 'working'
        } else{
             status='finished'
        }

    
       

      let updatePayment = await AssignStudent.updateMany({groupID: req.params.id }, {
        status:status

    });
   

    //هنا كده فيه مشكلتين ا كل مره هعمل تعديل هبعت ريكويستين حتي لو مش هعدل حالة الجروب

    updateGroup = await require('../Functions/update-group')(req, res, updateGroup)


    if (!updateGroup) return res.send({ result: false, message: 'error in DB' });

    await updateGroup.save();
    res.send({ result: true, data: updateGroup });
  // } catch (err) {
  //   next(err);
  // }

});

module.exports = router;
