let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../index');
let database_connect = require('../database_connect');
const { response } = require('../index');

chai.should();
chai.use(chaiHttp);

describe('Social Media Post Test', () => {

    before(() => {
            database_connect();
        })
        //GET
    describe('GET /api/', () => {
        it("Should GET all the posts with given JWT token", (done) => {
            const jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM5YTI1YzI3ODI5YmYzY2VjNGQzZjA5In0sImlhdCI6MTY3MTA2OTg5MiwiZXhwIjoxNjcxMTU2MjkyfQ.cX8iR-ioKBktRwC0MbZGtGP-QpBNzVH2R1XENDDS63Q';
            chai.request(server)
                .get('/api/all_posts/')
                .set('x-access-token', jwt_token)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('all_posts');
                    done();
                })
        });




    });

    //POST
    describe('POST /api/', () => {

        describe('POST /api/posts', () => {

            it("Should publish a post when provided with relevant data", (done) => {
                let jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM5YTI1YzI3ODI5YmYzY2VjNGQzZjA5In0sImlhdCI6MTY3MTA2OTg5MiwiZXhwIjoxNjcxMTU2MjkyfQ.cX8iR-ioKBktRwC0MbZGtGP-QpBNzVH2R1XENDDS63Q';
                let post_data = {
                    title: "Hey",
                    description: "Hopefully I will join Reunion"
                }
                chai.request(server)
                    .post('/api/posts')
                    .set('x-access-token', jwt_token)
                    .send(post_data)
                    .end((err, response) => {
                        response.should.have.status(201);
                        response.body.should.have.property('post_id');
                        response.body.should.have.property('title');
                        response.body.should.have.property('description');
                        response.body.should.have.property('created_at');
                        done();
                    })
            })

            it("Should NOT publish a post when provided with Malformed or Incorrect JWT Token", (done) => {
                let jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI7IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM5YTI1YzI3ODI5YmYzY2VjNGQzZjA5In0sImlhdCI6MTY3MTA2OTg5MiwiZXhwIjoxNjcxMTU2MjkyfQ.cX8iR-ioKBktRwC0MbZGtGP-QpBNzVH2R1XENDDS63Q';
                let post_data = {
                    title: "Hey",
                    description: "Hopefully I will join Reunion"
                }
                chai.request(server)
                    .post('/api/posts')
                    .set('x-access-token', jwt_token)
                    .send(post_data)
                    .end((err, response) => {
                        response.should.have.status(403);
                        response.text.includes("Unauthorised")
                        done();
                    })
            });

            it("Should NOT publish a post when provided with incomplete fields", (done) => {
                let jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM5YTI1YzI3ODI5YmYzY2VjNGQzZjA5In0sImlhdCI6MTY3MTA2OTg5MiwiZXhwIjoxNjcxMTU2MjkyfQ.cX8iR-ioKBktRwC0MbZGtGP-QpBNzVH2R1XENDDS63Q';
                let post_data = {
                    // title: "Hey",
                    description: "Hopefully I will join Reunion"
                }
                chai.request(server)
                    .post('/api/posts')
                    .set('x-access-token', jwt_token)
                    .send(post_data)
                    .end((err, response) => {
                        response.should.have.status(401);
                        response.text.includes("Insufficient Data");
                        done();
                    })
            });
        });

        describe("POST /api/posts/:id", () => {
            const id = '639a3b5716ce96ea742cb013';
            // const jwt_token
            it("Should get post for correct ID", (done) => {
                chai.request(server)
                    .get('/api/posts/' + id)
                    .end((err, response) => {
                        response.should.have.status(201);
                    });
                done();
            })
        })

    });


})

//GET