const jwt = require('jsonwebtoken');


module.exports=function (req,res,next){
const token= req.header('Authorization');
   if(!token) {
       return res.status(401).send('access denied.no token provided');
   }
    try {
        const decoded=jwt.verify(token,'123456');
        req.user=decoded;
        next();
     } 
      catch(ex){
          res.status(400).send('invalid token');
    } 
}