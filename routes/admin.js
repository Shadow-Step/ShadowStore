const route = require('express').Router();

route.use((req,res,next)=>{
    if(!req.session.isAdmin){
        return res.redirect('/profile/login');
    }
    else{
        next();
    }
})
route.get('/',(req,res)=>{
    const db = req.app.db.users;
    db.findOne({email: req.session.email},(err,user)=>{
        if(user != null){
            res.render('admin',{user: user});
        }
    });
})
module.exports = route;