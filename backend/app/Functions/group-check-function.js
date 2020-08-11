
const { Group } = require('../models/groups');
const { Track } = require('../models/tracks')
const moment = require('moment');
const groupEndDate = require('./End-Date');
const { Course } = require('../models/courses');
const { Vacation } = require('../models/vacations');


module.exports = async (req, res, group) => {


  //generate group name dinamic
  const course = await Course.findOne({ courseID: req.body.courseID });
  const groups = await Group.find({ courseID: req.body.courseID }).sort('groupID').select('-_id -__v');

  let groupNumber;
  if (groups.length > 0) {
    groupNumber = groups[groups.length - 1].groupID
    group.groupName = course.courseName + (groups.length+1)
  } else {
    group.groupName = course.courseName + 1
  }

  let { groupSchedule, groupStartDate, groupTracks } = req.body;


  // هنا هخليه يحسبلي تواريخ بداية ونهاية التراكات
  // بقوله خليلي تاريخ بداية اول تراك هو تاريخ بداية الجروب وبتاريخ البدايه اعرف اجيب تاريخ
  //نهاية التراك وبعدين اشوف هل  اخر يوم في التراك ده هيتبقي لسه فيه ساعات في اليوم فيبدا
  //التراك التاني في نفس اليوم ولا مش هيبقي فيه ساعات فاروح اشوف اليوم اللي عليه الدور في 
  // الجدول بعد كام يوم من النهارده واروح احسب تاريخ بداية التراك اللي عليه الدور ومنه اجيب تاريخ نهاية الكورس وهكذا ...

  let courseHours = 0; // ليه هنا علي طول محطتش قيمته بعدد ساعات الكورس وخلاص علشان لو الجروب ماخدتش كل التراكات
  let ResetHours = 0; //دي علشان احط فيها الساعات اللي فاضله من اخر يوم في التراك علشان احسب التراك اللي بعده
  const vacations = await Vacation.find();

  for (let i = 0; i < groupTracks.length; i++) {

    const trackID = await Track.findOne({ trackID: groupTracks[i].trackID });
    group.groupTracks[0].trackStartDate = groupStartDate; // اول تراك بيبدا في نفس تاريخ بداية الجروب

    let trackHours = trackID.trackHours; // بجيب عدد ساعات التراك
    let trackstartdate = group.groupTracks[i].trackStartDate // هنا متغير بحط فيه تاريخ بداية التراك علشان اقوله ادخل هاتلي تاريخ نهايته

    courseHours += trackID.trackHours;// بقوله جمعلي عدد ساعات التراكات كلها علشان اعرف عدد ساعات الكورس
    //  ادخل هاتلي تاريخ نهاية التراك وكمان هاتلي تواريخ وايام كل المحاضرات للتراك ده
    let groupEndDateFunction = groupEndDate(groupSchedule, trackstartdate, trackHours, ResetHours, vacations);
    // الفنكشن دي بترجعلي 3 حاجات تاريخ نهاية التراك وتواريخ وايام كل محاضرات التراك وهل فيه وقت باقي من اخر يو ولا لا 
    group.groupTracks[i].trackEndDate = groupEndDateFunction.startdate; // تاريخ نهايه التراك
    group.groupTracks[i].trackHistory = groupEndDateFunction.courseHistory // محاضرات التراك بايامها وتواريخها

    // هنا بقوله لو خلاص كده جبت تواريخ بداية ونهاية كل التراكات اطلع
    if (i + 1 >= groupTracks.length) {
      break;
    } else {
      console.log(groupEndDateFunction.resetHours)
      //لو لسه فيه تراكات بقي تعالي فيه حالتين الاولي لو لسه فاضل ساعات في اخر يوم في 
      //التراك الاول فهنبدا التراك اللي بعده في تفس اليوم
      if (groupEndDateFunction.resetHours < 0) {
        //  console.log(groupEndDateFunction.resetHours)
        ResetHours = groupEndDateFunction.resetHours;
        group.groupTracks[i + 1].trackStartDate = groupEndDateFunction.startdate;
        // هنا المشكله ان لو اليوم 5 ساعات واتبقي ساعتين فهو هيبدا في نفس اليوم عادي بس هيحسب ان اليوم 5 ساعات 
      } else {
        ResetHours = 0;
        // لو مفيش لسه فاضل ساعات من التراك الاول فتعالي بقي نشوف اليوم اللي بعد كده في الجدول تاريخه ايه ويبقي هو ده تاريخ بداية الكورس اللي بعده 
        //ودي ببساطه فكرتها اشوف اخر يوم في الجدول يوم ايه وؤقم الاندكس بتاعه كام واليوم اللي عليه الدور في الجدول الاندكس بتاعه كام
        //ومن خلال الاندكس اعرف الفرق بينهم كام يوم وازوده علي تاريخ نهاية التراك الاول ويبقي هو ده تاريخ بداية التراك التاني

        weekArray = moment.weekdays(); //هنا بجيب كل ايام الاسبوع
        let startdateday = weekArray[new Date(groupEndDateFunction.startdate).getDay()]; // جبت اليوم ده يوم ايه
        let startdatedayindex = weekArray.indexOf(startdateday); // هنا جبت رقم الاندكس بتاعه 


        // هنا بشوف اليوم اللي عليه الدور 
        let enddate;
        for (let i = 0; i < groupSchedule.length; i++) {
          // console.log(startdateday,groupSchedule[i].days) 
          if (startdateday == groupSchedule[i].days) {
            if (i + 1 >= groupSchedule.length) {
              enddate = groupSchedule[0].days; // هنا بقوله لو ده اخر يوم في الجدول يبقي هات اول يوم
              break;
            } else {
              enddate = groupSchedule[i + 1].days; // ولو مش اخر يوم في الجدول هات اليوم اللي بعده عادي
              break;
            }

          }
        }

        let enddatedayindex = weekArray.indexOf(enddate); // هاتليالاندكس بتاع اليوم اللي عليه الدور في الجدول

        let nextDay; // هنا بجيب اليوم اللي عليه الدور
        if (startdatedayindex >= enddatedayindex) {
          nextDay = (6 - startdatedayindex) + (enddatedayindex + 1);//
        } else {
          nextDay = enddatedayindex - startdatedayindex;
        }
        group.groupTracks[i + 1].trackStartDate = moment(groupEndDateFunction.startdate).add(nextDay, 'd');
      }
    }
  }





  // هنا بجيب تاريخ نهاية الكورس كله 
  let groupEndDateCalc = groupEndDate(groupSchedule, groupStartDate, courseHours, 0, vacations);
  group.groupEndDate = groupEndDateCalc.startdate;
  //هنا بجيب كل المحاضرات التاريخ واليوم
  group.cousreHistory = groupEndDateCalc.courseHistory;


  if (!group.groupEndDate) return res.send({ result: false, message: 'End date in not calculated' });

  return group;

}