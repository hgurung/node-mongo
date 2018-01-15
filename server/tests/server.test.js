const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
},
{
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 1231
}];

beforeEach((done) => {
    Todo.remove({}).then(() =>  {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create new todos',  (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
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
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('it should get single todo', (done) => { 
        var id = '5a5877656a0cd65012aa046c';
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should return 404 if not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('it should return 404 ffor non object id', (done) => {
        request(app)
            .get(`/todos/123}`)
            .expect(404)
            .end(done);
    });

});

describe('GET delete:id', () => {
    var hexId = todos[1]._id.toHexString();
    it('It should remove todo', (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
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

    it('It should return 404 if not found', (done) => {
        var hexId  = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('It should return 404 if object id is invalid',(done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH todos/:id' , () => {
    it('It should update todo', (done) => {
        var hexId  = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text:'Some updates',completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Some updates');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('It should clear completedAt when todo is not completed',(done) => {
        var  hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text:'Some updates1',completed: false})
            .expect(200)
            .expect((res) => {  
                expect(res.body.todo.text).toBe('Some updates1');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
        done();
    });
});