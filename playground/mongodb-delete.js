const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Connected to mongo db server');

    // db.collection('Todos').deleteMany({text: 'What the heck'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'What the heck'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').findOneAndDelete({text: 'What the heck'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name: 'Harris'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteOne({name: 'Harry'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').findOneAndDelete({name: 'Bemita'}).then((result) => {
    //     console.log(result);
    // });

    // db.close();
});