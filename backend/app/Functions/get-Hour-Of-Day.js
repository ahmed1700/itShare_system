const moment = require('moment');

let getHoursOfDay = (groupSchedule) => {

  //gettingnumberOfHoursInWeek
  let signIn = (new Date()).toDateString()
  let weekArray = moment.weekdays();
  let today = weekArray[new Date(signIn).getDay()];
  let gSchedule = groupSchedule.find(t => t.days === today)
  hours = 0, minutes = 0;

  const resulltHourfrom = gSchedule.Hourfrom.split(":");
  var dHourfrom = new Date('', '', '', resulltHourfrom[0], resulltHourfrom[1]);
  const resulltHourto = gSchedule.Hourto.split(":");
  var dHourto = new Date('', '', '', resulltHourto[0], resulltHourto[1]);
  hours = dHourto.getHours() - dHourfrom.getHours();
  minutes = dHourto.getMinutes() - dHourfrom.getMinutes();

  groupActualHours = hours + '.' + minutes
  return { 'groupActualHours': groupActualHours, 'dHourfrom': dHourfrom, 'dHourto': dHourto };
}

let getHoursOfDayUpdate = (date, groupSchedule) => {
  //gettingnumberOfHoursInWeek
  let signIn = (new Date(date)).toDateString()
  let weekArray = moment.weekdays();
  let today = weekArray[new Date(signIn).getDay()];
  let gSchedule = groupSchedule.find(t => t.days === today)
  if (!gSchedule) {
    return 0
  } else {
    hours = 0, minutes = 0;
    const resulltHourfrom = gSchedule.Hourfrom.split(":");
    var dHourfrom = new Date('', '', '', resulltHourfrom[0], resulltHourfrom[1]);
    const resulltHourto = gSchedule.Hourto.split(":");
    var dHourto = new Date('', '', '', resulltHourto[0], resulltHourto[1]);
    hours = dHourto.getHours() - dHourfrom.getHours();
    minutes = dHourto.getMinutes() - dHourfrom.getMinutes();

    groupActualHours = hours + '.' + minutes
    return { 'groupActualHours': groupActualHours, 'dHourfrom': dHourfrom ,'dHourto': dHourto };;
  }

}
let getHoursAtt = (sginOut, sginIn, HourFrom, HourTo) => {
  let gSignIn = HourFrom
  let gSignOut = HourTo
  let hours = 0
  let minutes = 0
  let rSignIn
  let rSignOut
  const resulltSginOut = sginOut.split(":");
  var dSginOut = new Date('', '', '', resulltSginOut[0], resulltSginOut[1]);
  const resulltSginIn = sginIn.split(":");
  var dSginIn = new Date('', '', '', resulltSginIn[0], resulltSginIn[1]);
  if (gSignIn > dSginIn) {
    rSignIn = gSignIn
  } else {
    rSignIn = dSginIn
  }

  if (gSignOut < dSginOut) {
    rSignOut = gSignOut
  } else {
    rSignOut = dSginOut
  }

  hours = rSignOut.getHours() - rSignIn.getHours()
  minutes = rSignOut.getMinutes() - rSignIn.getMinutes();
  let d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  return d.getHours() + '.' + d.getMinutes();
}
let realTeachedHour = (sginOut, sginIn) => {
  const resulltSginOut = sginOut.split(":");
  var dSginOut = new Date('', '', '', resulltSginOut[0], resulltSginOut[1]);
  const resulltSginIn = sginIn.split(":");
  var dSginIn = new Date('', '', '', resulltSginIn[0], resulltSginIn[1]);
  hours = dSginOut.getHours() - dSginIn.getHours();
  minutes = dSginOut.getMinutes() - dSginIn.getMinutes();

  let d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  return d.getHours() + '.' + d.getMinutes();
}


module.exports.getHoursAtt = getHoursAtt;
module.exports.getHoursOfDay = getHoursOfDay;
module.exports.getHoursOfDayUpdate = getHoursOfDayUpdate
module.exports.realTeachedHour = realTeachedHour





