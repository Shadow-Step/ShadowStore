const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongodb-session')(session);
const hbs = require('hbs');
const app = express();

//temp engine
app.set('view engine','hbs');
app.use(express.static(__dirname + '/client'));
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
    res.redirect('/main.html')
})
app.use('/products',require('./routes/products'));
app.use('/profile',require('./routes/profile'));
//Init db and start listening
MongoClient.connect('mongodb://localhost:27017/',{useNewUrlParser: true},(err,client)=>{
    if(err){
        console.log(err);
    }
    const db = client.db('ShadowStore');
    db.users = db.collection('users');
    db.products = db.collection('products');
    app.db = db;
    app.listen(3000);
});
module.exports = app;