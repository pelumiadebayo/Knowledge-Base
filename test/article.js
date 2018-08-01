const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
chai.use(chaiHttp);

describe('CRUD for article resources', function () {

    it('create new article', function (done) {
        chai.request(app)
            .post('/article/add')
            .send({
                title: "testing",
                author: "Pelumi",
                body: "this is testing written by Pelumi "
            })
            .end(function (err, res) {
                expect(res.body).to.have.property('_id');
                // expect('Location', '/');
                console.log(res.body);

                done()
            })
    });
    // it('edit article', function (done) {
    //     chai.request(app)
    //         .post('/article/add/edit/:id')
    //         .send({
    //             title: "test"
    //         }).end(function (err, res) {
    //             expect(res.title).to.be('test');
    //         })
    // })
})