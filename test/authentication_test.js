let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../index');
let database_connect = require('../database_connect');


chai.should();
chai.use(chaiHttp);

//POST
describe('User Authentication Test', () => {
    before(() => {
        database_connect();
    })

    describe('POST /api/', () => {

        it('Should get a JWT token in return when given correct email and password', (done) => {

            const user_data = {
                email: "test@gmail.com",
                password: "test1@gmail.com"
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(user_data)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('token');
                    done();
                });
        });

        it("Should not receive data when email or password field empty or absent or wrong", (done) => {

            const user_data = {
                // email: "test@gmail.com",
                password: "testsad1@gmail.com"
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(user_data)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.text.includes('Email or Password Incorrect');
                    done();
                })
        });
    })

})