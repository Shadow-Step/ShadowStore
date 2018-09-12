const route = require('express').Router();

route.use((req,res,next)=>{
    if(!req.session.isAdmin){
        return res.redirect('/login');
    }
    else{
        next();
    }
})
route.get('/',(req,res)=>{
    res.send('admin');
})
module.exports = route;