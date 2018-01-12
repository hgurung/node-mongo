const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Connected to mongo db server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5a574cbcf15fea192c9ec2c6')
    //     }).toArray().then((docs) => {
    //     console.log('Todos ', JSON.stringify(docs,undefined,2));
    // }, (err) => {
    //     console.log('Unable to fetch todos');
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos');
    // });

    db.collection('Users').find({
        name: 'Harris'
    }).toArray().then((docs) => {
        console.log(`Todos ${JSON.stringify(docs,undefined,2)}`);
    }, (err) => {
        console.log('Unable to fetch todos');
    });

    // db.close();
});