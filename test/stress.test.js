const loadtest = require('loadtest');
const chai = require('chai');
const request = require('request');

const app = require('../app');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## Stress tests', function() {
    describe('# homepage should handle 100 requests in a second', function() {
        it('should ok', function(done) {
            const options = {
                url: 'http://localhost:3000',
                concurrency: 4,
                maxRequests: 100,
            };
            loadtest.loadTest(options, function(err, result) {
                if (err) {
                    return done(err);
                }
                expect(result.totalTimeSeconds).to.be.below(1);
                done();
            });
        });
    });
});
