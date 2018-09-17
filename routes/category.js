const route = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const common = require('../lib/common')

//Get all categories
route.get('/get',(req,res)=>{
    const db = req.app.db.categories;
    db.find().toArray((err,array)=>{
        if(err){
            return console.log(err);
        }
        return res.status(200).json(array);
    });
});
//Remove one
route.get('/remove/:id',(req,res)=>{
    common.checkId(req.params.id);
});

module.exports = route;