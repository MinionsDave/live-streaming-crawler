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
            let example;
            describe(`get ${item}`, () => {
                it('should return the list and list\'s length large than 0', done => {
                    crawlFn(item)
                        .then(list => {
                            expect(list).to.be.an('array');
                            expect(list.length).to.be.above(1);
                            if (list instanceof Array && list.length > 0) {
                                example = list[0];
                                Object.freeze(example);
                            }
                            done();
                        })
                        .catch(done);
                });

                for(let item of ['title', 'anchor', 'audienceNumber', 'snapshot', 'url', 'platformIcon']) {
                    it(`the info should has the ${item}`, function () {
                        if (example) {
                            expect(example[item]).to.be.ok;
                        } else {
                            this.skip;
                        }
                    });
                }
            });
        }
    });
}