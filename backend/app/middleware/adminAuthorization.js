
module.exports=function (req,res,next){
    if(req.user.role!='Admin'){
        res.status(401).send('only admin can access');
        next();
    }else{
        next();
    }
} 