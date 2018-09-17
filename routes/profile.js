const route = require('express').Router();
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;

//Register
route.get('/register',(req,res)=>{
    res.render('testreg.hbs');
});
route.post('/register',(req,res)=>{
    const db = req.app.db.users;
    let user = {email: req.body.email, pass: bcrypt.hashSync(req.body.pass,10)};
    db.findOne({email: user.email},(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result == null){
            db.insertOne(user,(err,insertResult)=>{
                if(err){
                    console.log(err);
                }
                res.redirect('/admin');
            })
        }
        else{
            res.status(400).json({message: 'user already exist'});
        }
    })
})
/////
//Login
route.get('/login',(req,res,)=>{
    const db = req.app.db.users;
    db.count({},(err,count)=>{
        if(count == 0){
            res.redirect('/register');
        }
        else{
            res.render('test');
        }
    });
});
route.post('/login',(req,res)=>{
    const db = req.app.db.users;
    db.findOne({email:req.body.email},(err,user)=>{
        if(err){
            console.log(err);
        }
        if(user == null){
            res.status(400).json({message: 'invalid email'});
        }
        else{
            if(bcrypt.compareSync(req.body.pass,user.pass) == true){
                req.session.email = req.body.email;
                req.session.isAdmin = true;
                req.session.logged = true;
                res.status(200).json({message: 'success'});
            }
            else{
                res.status(400).json({message: 'invalid password'})
            }
        }
    });
});
//Logout
route.get('/logout',(req,res)=>{
    req.session.isAdmin = null;
    req.session.email = null;
    res.status(200).json({message: {message: 'logout'}});
})

//Profile
route.get('/:id',(req,res)=>{
    if(!req.session.logged){
        res.redirect('/profile/login');
    }
    const db = req.app.db.users;
    if(req.params.id.length == 24){
        let _id = new ObjectID(req.params.id);
        db.findOne({_id : _id},(err,user)=>{
            if(user == null){
                return res.status(400).json({message: 'no such user'});
            }
            if(req.session.email === user.email){
                return res.status(200).json({message: user});
            }
            else{
                return res.status(400).json({message: 'error'});
            }
        });
    }
    else{
        res.status(400).json({message: 'invalid id'});
    }
});
module.exports = route;