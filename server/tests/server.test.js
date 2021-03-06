const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create new todos',  (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create with todo data with invalid data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send()
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));

            });
    });
});


describe('GET /todos', () => {
    it('it should get todos list', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('it should get single todo', (done) => { 
        var id = '5a5877656a0cd65012aa046c';
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should not return todo created by other', (done) => { 
        var id = '5a5877656a0cd65012aa046c';
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('it should return 404 if not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('it should return 404 ffor non object id', (done) => {
        request(app)
            .get(`/todos/123}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe('GET delete:id', () => {
    it('It should remove todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos._id).toBe(hexId);
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('It should not remove todo not owned by user', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('It should return 404 if not found', (done) => {
        var hexId  = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('It should return 404 if object id is invalid',(done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH todos/:id' , () => {
    it('It should update todo', (done) => {
        var hexId  = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .send({text:'Some updates',completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Some updates');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('It should not update todo from another user', (done) => {
        var hexId  = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .send({text:'Some updates',completed: true})
            .expect(404)
            .end(done);
    });

    it('It should clear completedAt when todo is not completed',(done) => {
        var  hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .send({text:'Some updates1',completed: false})
            .expect(200)
            .expect((res) => {  
                expect(res.body.todo.text).toBe('Some updates1');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return users if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
            
    });

    it('should return 401 if not authenticated', (done)=> {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /users',() => {
    it('should create a user', (done) => {
        var email = 'h.gurung123@gmail.com';
        var password = '123admin@'; 
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }
            User.findOne({email: email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end(done);
    });

    it('should not create users if email is already in use', (done) => {
        var email = users[0].email;
        var password = '123admin@';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login and return token', (done) => {
        request(app)
        .post('/users/login')
        .send({email:users[1].email, password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.body.email).toBe(users[1].email);
            expect(res.body._id).toExist();
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });
            
    });

    it('should return 404 if user not found', (done) => {
        request(app)
        .post('/users/login')
        .send({email:users[1].email + '1', password: users[1].password})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('DELETE users/me/token', () => {
    it('it should delete user token', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                done();
                // User.findById(users[0]._id).then((user) => {
                //     expect(user.tokens.length).toBe(0);
                //     done();
                // }).catch((e) => done(e));
            });
    });
});