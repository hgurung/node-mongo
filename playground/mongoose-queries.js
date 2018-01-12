const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
// var id = '6a5877656a0cd65012aa046cHAR';

// if(!ObjectID.isValid(id)){
//     return console.log('Id is not valid');
// }
// Todo.find({
//     _id: id
// }).then((result) => {
//     console.log('Todos', result);
// }).catch((err) => console.log(err));

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// }).catch((err) => console.log(err));



// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by id', todo);
// }).catch((err) => console.log(err));

var id = '5a5865e0269065de0cb77958';

User.findById(id).then((users) => {
    if(!users) {
        return console.log('User not found');
    }
    console.log('Users',users);
}).catch((err) => console.log(err));