const route = require('express').Router();
const ObjectID = require('mongodb').ObjectID;

// //Check access
// route.use((req,res,next)=>{
//     if(!req.session.isAdmin){
//         return res.redirect('/profile/login');
//     }
//     else{
//         next();
//     }
// })

/////
//Products
/////

//Get all
route.get('/get',(req,res)=>{
    const db = req.app.db.products;
    db.find().toArray((err,products)=>{
        res.status(200).json(products);
    });
});
//Insert one
route.post('/insert',(req,res)=>{
    let db = req.app.db.products;
    let product = req.body;
    db.insertOne(product,(err,result)=>{
        if(err){
            return console.log(err);
        }
        let categories = req.app.db.categories;
        categories.countDocuments({name: product.category},(err,count)=>{
            if(count == 0){
                categories.insertOne({name: product.category},(err,insert)=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
            res.status(200).json({message: 'success'});
        })
    });
});
//Remove one
route.get('/remove/:id',(req,res)=>{
    const db = req.app.db.products;
    if(req.params.id.length != 24){
        return res.status(400).json({message: 'invalid id'});
    }
    else{
        let _id = new ObjectID(req.params.id);
        db.remove({_id:_id},(err,result)=>{
            if(err){
                return console.log(err);
            }
            res.status(200).json({message: 'success'});
        });
    }
});
//Edit one
route.post('/edit/:id',(req,res)=>{
    const db = req.app.db.products;
    if(req.params.id.length != 24){
        return res.status(400).json({message: 'invalid id'});
    }
    else{
        let product = req.body;
        let _id = new ObjectID(req.params.id);
        db.updateOne({_id: _id},{$set:{name: product.name,price: product.price,category: product.category}},(err,result)=>{
            if(err){
                return console.log(err);
            }
            res.status(200).json({message: 'success'});
        });
    }
});
//Get one
route.get('/get/:id',(req,res)=>{
    const db = req.app.db.products;
    if(req.params.id.length != 24){
        return res.status(400).json({message: 'invalid id'});
    }
    else{
        let _id = new ObjectID(req.params.id);
        db.findOne({_id:_id},(err,result)=>{
            if(err){
                return console.log(err);
            }
            res.status(200).json(result);
        });
    }
});
module.exports = route;