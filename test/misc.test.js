const request = require('supertest-as-promised');
const chai = require('chai');

const app = require('../app');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## Misc', () => {
    describe('# health check', () => {
        it('should ok', done => {
            request(app)
                .get('/lol')
                .expect(200)
                .then(done)
                .catch(done);
        });
    });

    describe('# 404 check', () => {
        it('should return status code 404', done => {
            request(app)
                .get('/asd')
                .expect(404)
                .then(done)
                .catch(done);
        });
    });
})