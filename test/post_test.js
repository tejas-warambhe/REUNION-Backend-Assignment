let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../index');
let database_connect = require('../database_connect');

chai.should();
chai.use(chaiHttp);

describe('Social Media Post Test', () => {

    before(() => {
            database_connect();
        })
        //GET
    describe('GET /api/', () => {
        it("Should GET all the posts with given id", (done) => {
            const id = '639a25c27829bf3cec4d3f09';
            chai.request(server)
                .get('/api/all_posts/' + id)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('currentUser');
                    done();
                })
        });

        it("Should NOT GET data when id is of wrong format", (done) => {
            const id = 'agasfaskjdhaskjdnsakd65';
            chai.request(server)
                .get('/api/all_posts/' + id)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.includes("Incorrect ID");
                    done();
                })
        });
        it("Should NOT GET data when id Format is Correct but user with such ID not present", (done) => {
            const id = '639a25c27829bf3cec4d3f08';
            chai.request(server)
                .get('/api/all_posts/' + id)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.includes("User not found");
                    done();
                })
        });

    });


})

//GET