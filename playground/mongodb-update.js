const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Connected to mongo db server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a574cbcf15fea192c9ec2c6')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a57502d7f532819e0cd8904')
    }, {
        $set: {
            name: 'Harris'
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result)=> {
        console.log(result);
    });

    // db.close();
});