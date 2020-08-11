const router = require('express').Router();
const _ = require('lodash');
const { publicPayment, validate } = require('../models/publicPayment');
const { Category } = require('../models/category');
const { Payment} = require('../models/payments');
const { StudentExam } = require('../models/student_exam');
const { Employee } = require('../models/employees');
const { Branch } = require('../models/branch')
const auth = require('../middleware/userAuthorization');

router.get('/',auth, async (req, res, next) => {
    try {
        const PublicPayment = await publicPayment.find().sort('publicPaymentID').select('-_id -__v');
         // get employees data
         let employeesID = PublicPayment.map(pay => pay.employeeID);
         let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
         // get branch data 
         let branch = await Branch.find().select('name branchID -_id');
           // get categories data
           let categoriesID = PublicPayment.map(pay => pay.categoryID);
           let categories = await Category.find({ categoryID: { $in: categoriesID } }).select('categoryID categoryName -_id'); 
 
         res.send({ result: true, data: PublicPayment,employees: employees, branch: branch,categories:categories});
    } catch (err) {
        next(err);
    }
});

router.post('/employeePayment',auth, async (req, res, next) => {
    try {
        const PublicPayment = await publicPayment.find({branchID:req.body.branchID,creationDate:{$gte:new Date(req.body.date).setHours(00, 00, 00),$lte:new Date(req.body.date).setHours(23, 59, 59)}}).sort('publicPaymentID').select('-_id -__v');
         // get employees data
        let employeesID = PublicPayment.map(pay => pay.employeeID);
        let employees = await Employee.find({ employeeID: { $in: employeesID } }).select('employeeID fullNameEnglish -_id');
        // get branch data 
        let branch = await Branch.find({ branchID: req.body.branchID }).select('name branchID -_id');
          // get categories data
          let categoriesID = PublicPayment.map(pay => pay.categoryID);
          let categories = await Category.find({ categoryID: { $in: categoriesID } }).select('categoryID categoryName -_id'); 

        res.send({ result: true, data: PublicPayment,employees: employees, branch: branch,categories:categories});
    } catch (err) {
        next(err); 
    } 
});

router.get('/:id',auth, async (req, res, next) => {
    try {
        const PublicPayment = await publicPayment.findOne({ publicPaymentID: req.params.id }).select('-_id -__v');
        if (!PublicPayment) return res.send({ result: false, message: 'the publicPayment with the given ID was not found' });
        res.send({ result: true, data: PublicPayment });
    } catch (err) {
        next(err);
    }
});



router.post('/',auth, async (req, res, next) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.send({ result: false, message: error.details[0].message });

        const category = await Category.findOne({ categoryID: req.body.categoryID });
        if (!category) { return res.send({ result: false, message: 'the category  is not correct' }) }


      
        const coursesInpayments = await Payment.find({ branchID: req.body.branchID, tranactionType: 'in' });
            
        let coursesInpaid = 0;
        if (coursesInpayments) {
            for (const p of coursesInpayments) { coursesInpaid += p.paid; }
        }

        const coursesOutpayments = await Payment.find({ branchID: req.body.branchID, tranactionType: 'out' });
        let coursesOutpaid = 0;
        if (coursesOutpayments)
        {
            for (const p of coursesOutpayments) { coursesOutpaid += p.paid; }
        }
        let coursesRemaingPayment = coursesInpaid - coursesOutpaid;


        const publicInpayments = await publicPayment.find({ branchID: req.body.branchID, tranactionType: 'in' });
            
        let publicInpaymentsInpaid = 0;
        if (publicInpayments) {
            for (const p of publicInpayments) { publicInpaymentsInpaid += p.paid; }
        }

        const publicInpaymentsOutpayments = await publicPayment.find({ branchID: req.body.branchID, tranactionType: 'out' });
        let publicInpaymentsOutpaid = 0;
        if (publicInpaymentsOutpayments)
        {
            for (const p of publicInpaymentsOutpayments) { publicInpaymentsOutpaid += p.paid; }
        }
        let publicInpaymentsRemaingPayment = publicInpaymentsInpaid - publicInpaymentsOutpaid;

          if(req.body.tranactionType=='out'){
              if((coursesRemaingPayment+publicInpaymentsRemaingPayment)<req.body.paid){
                return res.send({ result: false, message: 'the paid  is more than existing money' }) 
              }
          }

 

        let PublicPayment = new publicPayment(
            {
                'employeeID': req.body.employeeID,
                'branchID': req.body.branchID,
                'categoryID': req.body.categoryID,
                'paid': req.body.paid,
                'tranactionType':req.body.tranactionType,
                'categoryDetails':req.body.categoryDetails
            }
        )


        if (!PublicPayment) return res.send({ result: false, message: 'error in the DB' });

        await PublicPayment.save();
        return res.send({ result: true, data:PublicPayment });
    } catch (err) {
        next(err);
    }


});


router.post('/allpayments',auth, async (req, res, next) => {
    try {
   
     let {branchID,start_date,end_date} =req.body

       if(!branchID&&!start_date&&!end_date){
        const coursesInpayments = await Payment.find({ tranactionType: 'in',paymentType:'Cash' });
            
        let coursesInpaid = 0;
        if (coursesInpayments) {
            for (const p of coursesInpayments) { coursesInpaid += p.paid; }
        }

        const coursesOutpayments = await Payment.find({ tranactionType: 'out' ,paymentType:'Cash' });
        let coursesOutpaid = 0;
        if (coursesOutpayments)
        {
            for (const p of coursesOutpayments) { coursesOutpaid += p.paid; }
        }
        let coursesRemaingPayment = coursesInpaid - coursesOutpaid;

        const publicInpayments = await publicPayment.find({ tranactionType: 'in' });
            
        let publicInpaymentsInpaid = 0;
        if (publicInpayments) {
            for (const p of publicInpayments) { publicInpaymentsInpaid += p.paid; }
        }

        const publicInpaymentsOutpayments = await publicPayment.find({ tranactionType: 'out',paymentType:'Cash' });
        let publicInpaymentsOutpaid = 0;
        if (publicInpaymentsOutpayments)
        {
            for (const p of publicInpaymentsOutpayments) { publicInpaymentsOutpaid += p.paid; }
        }
        let publicInpaymentsRemaingPayment = publicInpaymentsInpaid - publicInpaymentsOutpaid;
    
         let exams = await StudentExam.find()

         let totalPaid = exams.reduce((a, b) => +a + +b.totalPrice, 0);
        let originalPrice= exams.reduce((a, b) => +a + +b.originalPrice, 0);

        let examProfit = totalPaid- originalPrice
        return res.send({ result: true,data:{
            coursesInput:coursesInpaid,coursesOutput:coursesOutpaid,corsesProfit:coursesRemaingPayment
            ,publicInput:publicInpaymentsInpaid,publicOutput:publicInpaymentsOutpaid,publicProfit:publicInpaymentsRemaingPayment,
            examsOriginalPrice:originalPrice,examsSellingPrice:totalPaid,examProfit:examProfit
        } 
        });
       }


       if(branchID&&!start_date&&!end_date){
        const coursesInpayments = await Payment.find({branchID: req.body.branchID, tranactionType: 'in',paymentType:'Cash' });
            
        let coursesInpaid = 0;
        if (coursesInpayments) {
            for (const p of coursesInpayments) { coursesInpaid += p.paid; }
        }

        const coursesOutpayments = await Payment.find({branchID: req.body.branchID, tranactionType: 'out',paymentType:'Cash' });
        let coursesOutpaid = 0;
        if (coursesOutpayments)
        {
            for (const p of coursesOutpayments) { coursesOutpaid += p.paid; }
        }
        let coursesRemaingPayment = coursesInpaid - coursesOutpaid;

        const publicInpayments = await publicPayment.find({branchID: req.body.branchID, tranactionType: 'in' ,paymentType:'Cash' });
            
        let publicInpaymentsInpaid = 0;
        if (publicInpayments) {
            for (const p of publicInpayments) { publicInpaymentsInpaid += p.paid; }
        }

        const publicInpaymentsOutpayments = await publicPayment.find({branchID: req.body.branchID, tranactionType: 'out' ,paymentType:'Cash'});
        let publicInpaymentsOutpaid = 0;
        if (publicInpaymentsOutpayments)
        {
            for (const p of publicInpaymentsOutpayments) { publicInpaymentsOutpaid += p.paid; }
        }
        let publicInpaymentsRemaingPayment = publicInpaymentsInpaid - publicInpaymentsOutpaid;
    
         let exams = await StudentExam.find({branchID: req.body.branchID})

         let totalPaid = exams.reduce((a, b) => +a + +b.totalPrice, 0);
        let originalPrice= exams.reduce((a, b) => +a + +b.originalPrice, 0);

        let examProfit = totalPaid- originalPrice
        return res.send({ result: true,data:{
            coursesInput:coursesInpaid,coursesOutput:coursesOutpaid,corsesProfit:coursesRemaingPayment
            ,publicInput:publicInpaymentsInpaid,publicOutput:publicInpaymentsOutpaid,publicProfit:publicInpaymentsRemaingPayment,
            examsOriginalPrice:originalPrice,examsSellingPrice:totalPaid,examProfit:examProfit
        } 
        });
       }


       if(branchID&&start_date&&end_date){
        const coursesInpayments = await Payment.find({branchID: req.body.branchID, tranactionType: 'in',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let coursesInpaid = 0;
        if (coursesInpayments) {
            for (const p of coursesInpayments) { coursesInpaid += p.paid; }
        }

        const coursesOutpayments = await Payment.find({branchID: req.body.branchID, tranactionType: 'out',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let coursesOutpaid = 0;
        if (coursesOutpayments)
        {
            for (const p of coursesOutpayments) { coursesOutpaid += p.paid; }
        }
        let coursesRemaingPayment = coursesInpaid - coursesOutpaid;

        const publicInpayments = await publicPayment.find({branchID: req.body.branchID, tranactionType: 'in',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash' });
            
        let publicInpaymentsInpaid = 0;
        if (publicInpayments) {
            for (const p of publicInpayments) { publicInpaymentsInpaid += p.paid; }
        }

        const publicInpaymentsOutpayments = await publicPayment.find({branchID: req.body.branchID, tranactionType: 'out',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let publicInpaymentsOutpaid = 0;
        if (publicInpaymentsOutpayments)
        {
            for (const p of publicInpaymentsOutpayments) { publicInpaymentsOutpaid += p.paid; }
        }
        let publicInpaymentsRemaingPayment = publicInpaymentsInpaid - publicInpaymentsOutpaid;
         let exams = await StudentExam.find({branchID: req.body.branchID,creationDate:{$gte:new Date(new Date(start_date).setHours(00, 00, 00)),$lte:new Date(new Date(end_date).setHours(23, 59, 59))},paymentType:'Cash'})
         let totalPaid = exams.reduce((a, b) => +a + +b.totalPrice, 0);
        let originalPrice= exams.reduce((a, b) => +a + +b.originalPrice, 0);

        let examProfit = totalPaid- originalPrice
        return res.send({ result: true,data:{
            coursesInput:coursesInpaid,coursesOutput:coursesOutpaid,corsesProfit:coursesRemaingPayment
            ,publicInput:publicInpaymentsInpaid,publicOutput:publicInpaymentsOutpaid,publicProfit:publicInpaymentsRemaingPayment,
            examsOriginalPrice:originalPrice,examsSellingPrice:totalPaid,examProfit:examProfit
        } 
        });
       }

       if(!branchID&&start_date&&end_date){
        const coursesInpayments = await Payment.find({ tranactionType: 'in',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let coursesInpaid = 0;
        if (coursesInpayments) {
            for (const p of coursesInpayments) { coursesInpaid += p.paid; }
        }

        const coursesOutpayments = await Payment.find({tranactionType: 'out',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let coursesOutpaid = 0;
        if (coursesOutpayments)
        {
            for (const p of coursesOutpayments) { coursesOutpaid += p.paid; }
        }
        let coursesRemaingPayment = coursesInpaid - coursesOutpaid;

        const publicInpayments = await publicPayment.find({ tranactionType: 'in',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash' });
            
        let publicInpaymentsInpaid = 0;
        if (publicInpayments) {
            for (const p of publicInpayments) { publicInpaymentsInpaid += p.paid; }
        }

        const publicInpaymentsOutpayments = await publicPayment.find({ tranactionType: 'out',creationDate:{$gte:new Date(start_date).setHours(00, 00, 00),$lte:new Date(end_date).setHours(23, 59, 59)},paymentType:'Cash'});
        let publicInpaymentsOutpaid = 0; 
        if (publicInpaymentsOutpayments)
        {
            for (const p of publicInpaymentsOutpayments) { publicInpaymentsOutpaid += p.paid; }
        }
        let publicInpaymentsRemaingPayment = publicInpaymentsInpaid - publicInpaymentsOutpaid;
         let exams = await StudentExam.find({creationDate:{$gte:new Date(new Date(start_date).setHours(00, 00, 00)),$lte:new Date(new Date(end_date).setHours(23, 59, 59))},paymentType:'Cash'})
         let totalPaid = exams.reduce((a, b) => +a + +b.totalPrice, 0);
        let originalPrice= exams.reduce((a, b) => +a + +b.originalPrice, 0);

        let examProfit = totalPaid- originalPrice
        return res.send({ result: true, data:{
            coursesInput:coursesInpaid,coursesOutput:coursesOutpaid,corsesProfit:coursesRemaingPayment
            ,publicInput:publicInpaymentsInpaid,publicOutput:publicInpaymentsOutpaid,publicProfit:publicInpaymentsRemaingPayment,
            
        } 
        }); 
       }
        
    } catch (err) {
        next(err);
    }


});
module.exports = router;