const moment = require('moment');

module.exports = function groupEndDate(groupSchedule, startdate, courseHours, ResetHours, vacations) {
 console.log(groupSchedule, startdate, courseHours, ResetHours, vacations)
  //هنا بقي عايزه احسب تاريخ نهاية الكورس واجيب ايام وتواريخ كل المحاضرات 
  //واشوف هل هيتبقي ساعات اخر يوم في التراك ولا لا 
  let totalHours = 0;
  let courseHistory = []

  let startDayDate = new Date(startdate)
  startdate = startDayDate.toDateString();
  weekArray = moment.weekdays();
  var startDateDayName = weekArray[startDayDate.getDay()];

  let vacationsDate = [];
  if (vacations.length) {
    for (let i = 0; i < vacations.length; i++) {
      let vacationsDay = new Date(vacations[i].date)
      vacationsDate.push(vacationsDay.toDateString())
    }
  }

  for (let i = 0; totalHours <= courseHours; i++) {
    for (let i = 0; i < groupSchedule.length; i++) {
      //console.log(startdate,'123456789')
      let resetHours = 0;
      let totalTrackHoursOfDay;
      let addToStartDat;
      startDateDayName == weekArray[new Date(startdate).getDay()];
      // هنا بديله النهارده يوم ايه وهو بيديني اليوم اللي عليه الدر في الجدول
      if (startDateDayName == groupSchedule[i].days) {
        let nextDay;
        if (i + 1 >= groupSchedule.length) {
          nextDay = groupSchedule[0].days;
        } else {
          nextDay = groupSchedule[i + 1].days;
        }
        // هنا بشوف ترتيبهم كام في الاسبوع علشان اشوف الفرق بينهم وازوده علي تاريخ البدايه ويبقي ده تاريخ اليوم اللي بعده
        let startdatedayindex = weekArray.indexOf(startDateDayName);
        let enddatedayindex = weekArray.indexOf(nextDay);

        // console.log('enddatedayindex', enddatedayindex, 'startdatedayindex', startdatedayindex);
        if (startdatedayindex >= enddatedayindex) {
          addToStartDat = (6 - startdatedayindex) + (enddatedayindex + 1);
        } else {
          addToStartDat = enddatedayindex - startdatedayindex
        }

        let nextDayDate = moment(startdate).add(addToStartDat, 'd')
        let nextDayDateString = new Date(nextDayDate);
        nextDayDate = nextDayDateString.toDateString(); //ده اليوم اللي عليه الدور في الجدول
        if (vacationsDate.includes(startdate)) {  // بقوله لو النهارده اجازه اطلع وروح ابدا سيكل جديده بتاريخ اليوم اللي عليه الدور
          startdate=new Date(startdate).toDateString() + ' '+ dHourfrom.getHours() + ':'+ dHourfrom.getMinutes();
            startdate=new Date(startdate).toDateString()
          startdate = nextDayDate;
          startDateDayName = weekArray[new Date(nextDayDate).getDay()]
          break;
        }

        else {
          //هنا بقوله لو النهارده مش اجازه شوفلي احنا يوم ايه في الجدول 
          //واليوم ده كام ساعه واخصمهم من عدد ساعات التراك 
          //وابدا سيكل
          const resulltHourfrom = groupSchedule[i].Hourfrom.split(":");
          var dHourfrom = new Date('', '', '', resulltHourfrom[0], resulltHourfrom[1]);
          const resulltHourto = groupSchedule[i].Hourto.split(":");
          var dHourto = new Date('', '', '', resulltHourto[0], resulltHourto[1]);
          var totalDayHours = dHourto.getHours() - dHourfrom.getHours();
          var totalDayMinutes = dHourto.getMinutes() - dHourfrom.getMinutes();
          let d = new Date();
          d.setHours(totalDayHours);
          d.setMinutes(totalDayMinutes);
          totalTrackHoursOfDay = d.getHours() + '.' + d.getMinutes();
          totalTrackHoursOfDay = parseInt(totalTrackHoursOfDay);
          if (ResetHours != 0) { // هنا بقوله لو انا بدات في نفس اليوم اللي انتهي فيه التراك التاني 
            //مش هتحسب ساعات اليوم كله هتحسب بس اللي اتبقي 
            totalTrackHoursOfDay = Math.abs(ResetHours);
            ResetHours = 0;
          }
          totalHours = totalHours + totalTrackHoursOfDay;
          resetHours = courseHours - totalHours;
         
          if (resetHours <= 0) {
            startdate=new Date(startdate).toDateString() + ' '+ dHourfrom.getHours() + ':'+ dHourfrom.getMinutes();
            startdate=new Date(startdate).toString()
            courseHistory.push(startdate);
            
            return { 'resetHours': resetHours, 'startdate': startdate, 'courseHistory': courseHistory }
          } else {
            startdate=new Date(startdate).toDateString() + ' '+ dHourfrom.getHours() + ':'+ dHourfrom.getMinutes();
            startdate=new Date(startdate).toString()
            courseHistory.push(startdate);
            startdate = nextDayDate;
          }
          startDateDayName = weekArray[new Date(nextDayDate).getDay()]
        }
        // نهاية الكونديشين
      }

      //نهاية الفور بتاع الجدول
    }
    //نهاية الفور بتاع عدد ساعات التراك
  }

}

