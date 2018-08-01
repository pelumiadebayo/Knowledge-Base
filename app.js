const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
mongoose.connect('mongodb://localhost:27017/nodekb', { useNewUrlParser: true });
db = mongoose.connection;
const app = express();


//checking for db's connection
db.once('open', () => {
    console.log('connected to mongo db');
});

//checking for db errors
db.on('error', (err) => {
    console.log(err);
});
app.use(expressValidator());
//setting up view engine directories
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//bring in model
let Article = require('./models/articles')

//express routing and using the article model for home page
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'Article',
                articles: articles
            });
        }
    });

});

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//seet public folder
app.use(express.static(path.join(__dirname, 'Public')));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

//another route to add article
app.get('/article/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        })
        return;
    });
});

//edit single article
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
        return;
    });
});

//submit POST form from add_article.pug
app.post('/article/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save((err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Added');
            // res.send(article);
            res.redirect('/');
        }
    })
});

//update POST form from edit_article.pug
app.post('/article/add/edit/:id', (req, res) => {
    let article = {};
    let query = { _id: req.params.id }

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

app.delete('/article/:id', (req, res) => {
    let query = { _id: req.params.id }
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        };
        res.send('sucess')
    })
})

//setting up port
app.listen(3000, () => {
    console.log('runnig on port 3000');
})

module.exports = app;