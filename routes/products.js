const route = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const Product = require('../lib/model').Product;
const Category = require('../lib/model').Category;
const idIsCorrect = require('../lib/common').idIsCorrect;

//Access check middleware must be here!

//Get all
route.get('/get',(req,res)=>{

    const db = req.app.db.products;
    db.find().toArray()
    .then(array => res.status(200).json(array))
    .catch(e => console.log(e));
});

//Insert one
route.post('/insert',(req,res)=>{

    const db = req.app.db.products;
    const dbcat = req.app.db.categories;
    const product = new Product(req.body);

    //Insert product, then check categories and insert new if needed
    db.insertOne(product)
    .then(() => dbcat.countDocuments({name: product.category}))
    .then((count) => count == 0 ? dbcat.insertOne(new Category({name: product.category})) : Promise.resolve())
    .then(() => res.status(200).json({message: 'product insert success'}))
    .catch(e => console.log(e));
});

//Remove one
route.get('/remove/:id',(req,res)=>{

    if(!idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.products;
    const _id = new ObjectID(req.params.id);

    db.remove({_id:_id})
    .then(() => res.status(200).json({message: 'product remove success'}))
    .catch(e => console.log(e));
});

//Edit one
route.post('/edit/:id',(req,res)=>{

    if(!idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.products;
    const dbcat = req.app.db.categories;
    const product = new Product(req.body);
    const _id = new ObjectID(req.params.id);

    //Update product, if category changed - check categories and insert new if needed
    db.updateOne({_id: _id}, product)
    .then(() => dbcat.countDocuments({name: product.category}))
    .then((count) => count == 0 ? dbcat.insertOne(new Category({name: product.category})) : Promise.resolve())
    .then(() => res.status(200).json({message: 'product edit success'}))
    .catch(e => console.log(e));
});

//Get one
route.get('/get/:id',(req,res)=>{

    if(!idIsCorrect(req.params.id)){
        return res.status(400).json({message: 'invalid id'});
    }

    const db = req.app.db.products;
    let _id = new ObjectID(req.params.id);

    db.findOne({_id:_id})
    .then(product => res.status(200).json(product))
    .catch(e => console.log(e));
});
module.exports = route;