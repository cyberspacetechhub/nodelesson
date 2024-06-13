const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

//custom milddleware logger

app.use(logger);


//cors stand for cross origin resource sharing

app.use(cors(corsOptions));

//built in middleware to handle urlencoded data
//in other words, form data
//content-type; application/x-www-urlencoded

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

//server static files

app.use('/', express.static(path.join(__dirname, '/public')));
// app.use('/subdir', express.static(path.join(__dirname, '/public')));

//routs
app.use('/', require('./routes/root'))
app.use('/employees', require('./routes/api/employees'));


//route handlers

// app.get('/hello(.html)?', (req, res, next) => {
//     console.log('Attempted to load hello.html');
//     next()
// }, (req, res) => {
//     res.send('Hello World!')
// })

//chain

// const one = (req, res, next) => {
//     console.log('one');
//     next()
// }

// const two = (req, res, next) => {
//     console.log('two');
//     next()
// }

// const three = (req, res, next) => {
//     console.log('three');
//     res.send('Finished')
// }
// app.get('/chain(.html)?', [one, two, three])


// app.use('/')
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({error: "404 Not found"});
    }else{
        res.type('txt').send("404 Not found")
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// The middleware is anything between the request (req) and the response (res)
// Three types of middleware (1) Built in middleware (2) Custom Middleware (3) MIddleware from third parties

//MVC model, view and controller