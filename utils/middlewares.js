export const isLogged=(req,res, next)=>{
    if(!req.session.name){
        res.status(401);
    } 
    console.log(req.session.name)
    next();
}

