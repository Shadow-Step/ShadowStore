const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongodb-session')(session);
const hbs = require('hbs');
const app = express();

//temp engine
app.set('view engine','hbs');
//app.use(express.static(__dirname + '/client'));
//Init parser
app.use(bodyParser.urlencoded({extended: false}));
//Init session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'SomeSecret',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 * 24
    },
    store: new MongoStore({uri:'mongodb://localhost:27017/',collection:'sessions'})
}));
//Set routes
app.get('/',(req,res)=>{
    const base = req.app.db.categories;
    const prod = req.app.db.products;
    base.find().toArray((err,result)=>{
        prod.find().toArray((err,asd)=>{
            res.render('categories',{categories: result, products: asd});
        });
    });
    
})
app.use('/products',require('./routes/products'));
app.use('/profile',require('./routes/profile'));
app.use('/category',require('./routes/category'));

//Init db and start listening
MongoClient.connect('mongodb://localhost:27017/',{useNewUrlParser: true})
.then(client =>{
    const db = client.db('ShadowStore');
    db.users = db.collection('users');
    db.products = db.collection('products');
    db.categories = db.collection('categories');
    app.db = db;
})
.then(()=> app.listen(3000))
.catch(e => console.log(e));

module.exports = app;