const chai = require('chai');

const crawler = require('../util/crawler');
const categoryList = require('../config/liveCategory');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## crawler APIs', () => {
    for(let item of Object.keys(crawler)) {
        commonCrawlerTest(item, crawler[item]);
    }
});

function commonCrawlerTest(crawlFnName, crawlFn) {
    describe(crawlFnName, () => {
        for(let item of Object.keys(categoryList)) {
            describe(`get ${item}`, () => {
                it('should return the list in 2s', done => {
                    // setTimeout(function() {
                    //     done(new Error('timeout for 2s'));
                    // }, 20000);
                    crawlFn(item)
                        .then(list => {
                            expect(list).to.be.an('array');
                            expect(list.length).to.be.above(1);
                            done();
                        })
                        .catch(done);
                });
            });
        }
    });
}