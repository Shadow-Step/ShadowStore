const route = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const common = require('../lib/common')
const Category = require('../lib/model').Category;

//Get all categories
route.get('/get',(req,res)=>{

    const db = req.app.db.categories;

    db.find().toArray()
    .then(array => res.status(200).json(array))
    .catch(e => console.log(e));
});

//Remove one
route.get('/remove/:id',(req,res)=>{
    
    if(!common.idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.categories;
    
    db.deleteOne({_id: new ObjectID(req.params.id)})
    .then(() => res.status(200).json({message: 'remove success'}))
    .catch(error => console.log(error))
});

//Insert one | TODO Validation
route.post('/insert',(req,res)=>{

    const db = req.app.db.categories;
    const category = new Category(req.body);

    db.findOne({name: category.name})
    .then(result => {
        return result == null ?
        db.insertOne(category) :
        Promise.reject({status: 400, message: 'category already exist'});
    })
    .then(() => res.status(200).json({message: 'insert success'}))
    .catch(e => res.status(e.status).json({message: e.message}));
});

//Edit one
route.post('/edit/:id',(req,res)=>{

    if(!common.idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.categories;
    const products = req.app.db.products;
    const _id = new ObjectID(req.params.id);
    const newName = req.body.name;
    
    db.findOne({_id : _id})
    .then(result => {
        //Update all products with old category or Reject() if Id doesn't exist
        return result == null ?
        Promise.reject({status: 400, message: "id doesn't exist"}) :
        products.updateMany({category: result.name},{$set: {category: newName}});  
    })
    .then(() => db.updateOne({_id : _id},{$set: {name: newName}}))
    .then(() => res.status(200).json({message: 'edit success'}))
    .catch(e => res.status(e.status).json({message: e.message}));
});
module.exports = route;