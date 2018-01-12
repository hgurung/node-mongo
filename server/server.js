var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Starter on port 3000');
});

module.exports = {app};