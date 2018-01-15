const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

var id = '5a5c24ed2d6ff256ce41b4a7';

Todo.findByIdAndRemove(id).then((result) => {
    console.log(result);
});

