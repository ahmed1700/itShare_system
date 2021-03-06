
const { Group } = require('../models/groups');
const { Track } = require('../models/tracks')
const moment = require('moment');
const groupEndDate = require('./End-Date');
const { Course } = require('../models/courses');
const { Vacation } = require('../models/vacations');
const { TeacheingAttendant } = require('../models/teacheingAttendant');

module.exports = async (req, res, group) => {

  const vacations = await Vacation.find();




  let { groupSchedule, groupStartDate, groupTracks } = req.body;

  let courseHours = 0;

  let ResetHours = 0;
  let attendantHours = 0
  for (let i = 0; i <= groupTracks.length - 1; i++) {

    const trackID = await Track.findOne({ trackID: groupTracks[i].trackID });

    // هنا هخليه يحسبلي تواريخ بداية ونهاية التراكات
    // بقوله خليلي تاريخ بداية اول تراك هو تاريخ بداية الجروب وبتاريخ البدايه اعرف اجيب تاريخ
    //نهاية التراك وبعدين اشوف هل  اخر يوم في التراك ده هيتبقي لسه فيه ساعات في اليوم فيبدا
    //التراك التاني في نفس اليوم ولا مش هيبقي فيه ساعات فاروح اشوف اليوم اللي عليه الدور في 
    // الجدول بعد كام يوم من النهارده واروح احسب تاريخ بداية التراك اللي عليه الدور ومنه اجيب تاريخ نهاية الكورس وهكذا ...

    group.groupTracks[0].trackStartDate = groupStartDate; // اول تراك بيبدا في نفس تاريخ بداية الجروب
    //  console.log(groupStartDate,'groupStartDate',group.groupTracks[0].trackStartDate);
    let attendant = await TeacheingAttendant.find({ groupID: req.params.id, trackID: trackID.trackID });
    attendantHours = attendant.reduce((a, b) => +a + +b.actualTeachedHours, 0);

    let trackHours = trackID.trackHours - attendantHours; // بجيب عدد ساعات التراك
    let trackstartdate = group.groupTracks[i].trackStartDate // هنا متغير بحط فيه تاريخ بداية التراك علشان اقوله ادخل هاتلي تاريخ نهايته
    
    
    courseHours += trackHours;// بقوله جمعلي عدد ساعات التراكات كلها علشان اعرف عدد ساعات الكورس
   
    //  ادخل هاتلي تاريخ نهاية التراك وكمان هاتلي تواريخ وايام كل المحاضرات للتراك ده
    let groupEndDateFunction = groupEndDate(groupSchedule, trackstartdate, trackHours, ResetHours, vacations);
   
    // الفنكشن دي بترجعلي 3 حاجات تاريخ نهاية التراك وتواريخ وايام كل محاضرات التراك وهل فيه وقت باقي من اخر يو ولا لا 
    group.groupTracks[i].trackEndDate = groupEndDateFunction.startdate; // تاريخ نهايه التراك
    group.groupTracks[i].trackHistory = groupEndDateFunction.courseHistory // محاضرات التراك بايامها وتواريخها
    // if (groupEndDateFunction.message != null) {
    //   return res.status(400).send(groupEndDateFunction.message)
    // }
    // هنا بقوله لو خلاص كده جبت تواريخ بداية ونهاية كل التراكات اطلع
    if (i + 1 >= groupTracks.length) {
      break;
    } else {
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