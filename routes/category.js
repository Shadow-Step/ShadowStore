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
    if(!common.checkId(req.params.id)){
        res.status(400).json({message: 'invalid id'});
    }
    const db = req.app.db.categories;
    db.remove({_id: new ObjectID(req.params.id)},(err,result)=>{
        if(err){
            return console.log(err);
        }
        res.status(200).json({message: 'success'});
    });
});
//Insert one
route.post('/insert',(req,res)=>{
    const db = req.app.db.categories;
    let name = req.body.name;
    db.findOne({name: name},(err,result)=>{
        if(err){
            return console.log(err);
        }
        if(result != null){
            return res.status(400).json({message: 'categoty already exist'});
        }
        else{
            db.insertOne({name: name},(err,insert)=>{
                if(err){console.log(err);}
                return res.status(200).json({message: 'success'});
            });
        }
    });
});
//Edit one
route.post('/edit/:id',(req,res)=>{
    const db = req.app.db.categories;
    if(!common.checkId(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }
    let _id = new ObjectID(req.params.id);
    db.findOne({_id: _id},(err,result)=>{
        if(err){
            return console.log(err);
        }
        if(result == null){
            return res.status(400).json({message: "category doesn't exist"});
        }
        let old = result.name;
        db.updateOne({_id : _id},{$set: {name: req.body.category}},(err,update)=>{
            if(err){
                console.log(err);
            }
            const products = req.app.db.products;
            products.updateMany({category: old},{$set: {category: req.body.category}},(err,prupdate)=>{
                if(err){
                    console.log(err);
                }
                res.status(200).json({message: 'success'});
            });
        });
    });
});
module.exports = route;