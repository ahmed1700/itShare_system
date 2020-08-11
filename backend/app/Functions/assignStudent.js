
const { Course } = require('../models/courses');
const  getTracksPrice  = require('./get-TotalPayment');


module.exports=async(req,res,assignStudent)=>{
    let { courseTracks } = req.body;
   
                     // بجيب سعر الكورس 
    const {priceAfterDiscount}=await Course.findOne({courseID: req.body.courseID});
     
                   //لو الموظف مدخلش السعر بايده 
    if(req.body.totalPayment==null){
        if(courseTracks==null){
            assignStudent.totalPayment= priceAfterDiscount;      //لو مدخلش التراكات هياخد سعر الكورس
        } else{
            totalPayment  = await getTracksPrice(req,courseTracks);
            assignStudent.totalPayment= totalPayment;
         }
         
    }
   return assignStudent;
}