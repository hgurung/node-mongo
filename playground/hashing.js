const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err,salt) => {
//     bcrypt.hash(password,salt,(err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$6fABAbcfDMvXt8O1eiNEKOmrtMw6PHrGqPCwjPIeE/LT8betvXUf.';
bcrypt.compare(password,hashedPassword, (err, res) => {
    console.log(res);
});
// var data = {
//     id: 10
// };

// var token = jwt.sign(data,'123abc');
// console.log(token);

// var decoded = jwt.verify(token,'123abc');
// console.log('decoded',decoded);

// var  message = 'What the heck';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somestring').toString()
// };

// // token.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data) + 'somestring').toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somestring').toString();
// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }

