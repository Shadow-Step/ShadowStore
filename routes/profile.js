const route = require('express').Router();
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;
const idIsCorrect = require('../lib/common').idIsCorrect;
const SafeProfile = require('../lib/model').SafeProfile;
const Profile = require('../lib/model').Profile;

//Register
route.get('/register',(req,res)=>{
    res.render('testreg.hbs');
});
route.post('/register',(req,res)=>{

    const db = req.app.db.users;
    const user = new Profile(req.body);
    
    db.findOne({email: user.email})
    .then(result => {
        return result == null ?
        db.insertOne(user) :
        Promise.reject({status: 400, message: 'email already exist'})
    })
    .then(() => res.status(200).json({message: 'register success'}))
    .catch(e => console.log(e));
});

//Login
route.get('/login',(req,res,)=>{

    const db = req.app.db.users;

    db.countDocuments({})
    .then(count =>{
        return count == 0 ?
        res.redirect('/register') :
        res.render('test')
    })
    .catch(e => console.log(e));
});
route.post('/login',(req,res)=>{

    const db = req.app.db.users;

    db.findOne({email:req.body.email})
    .then(user => {
        return user == null ?
        Promise.reject({status: 400, message: 'invalid email'}) :
        bcrypt.compare(req.body.password,user.password)
    })
    .then(compareResult => {
        if(compareResult == true){
            req.session.email = req.body.email;
            req.session.isAdmin = true;
            req.session.logged = true;
            return res.status(200).json({message: 'login success'});
        }
        else{
            return Promise.reject({status: 400, message: 'invalid password'})
        }
    })
    .catch(e => console.log(e));
});
//Logout
route.get('/logout',(req,res)=>{
    req.session.isAdmin = null;
    req.session.email = null;
    return res.status(200).json({message: {message: 'logout'}});
})

//Profile
route.get('/:id',(req,res)=>{

    if(!req.session.logged){
        res.redirect('/profile/login');
    }
    if(!idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.users;
    const _id = new ObjectID(req.params.id);

    db.findOne({_id: _id})
    .then(profile => {
        return profile == null ?
        Promise.reject({status: 400,message: "user doesn't exst"}) :
        res.status(200).json(new SafeProfile(profile))
    })
    .catch(e => console.log(e));
});
module.exports = route;