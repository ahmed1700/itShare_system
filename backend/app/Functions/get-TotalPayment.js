const { Track } = require('../models/tracks');
module.exports = async (req,courseTracks) => {
    let totalCoursePrice=[]
    for (let i = 0; i < courseTracks.length; i++) {
        let courseTrack = await Track.findOne({ trackID:courseTracks[i].trackID });
        totalCoursePrice.push(courseTrack.price)
    }
    coursePrice = totalCoursePrice.reduce((a, b) => a + b, 0);
     return coursePrice 
}