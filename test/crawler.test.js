const chai = require('chai');

const crawler = require('../util/crawler');
const categories = require('../config/category');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## crawler APIs', () => {
    for(let item of Object.keys(crawler)) {
        commonCrawlerTest(item, crawler[item]);
    }
});

function commonCrawlerTest(crawlFnName, crawlFn) {
    describe(crawlFnName, () => {
        for(let item of Object.keys(categories)) {
            let example;
            describe(`get ${item}`, function() {
                it('should return the list and list\'s length large than 0', function(done) {

                    /**
                     * 如果类目下不存在该平台的url
                     * 表示该平台没有该直播类目
                     * 则不做测试
                     */
                    if (!categories[item][crawlFnName]) {
                        return this.skip();
                    }

                    let res = crawlFn(item);
                    res.then(list => {
                        expect(list).to.be.an('array');
                        expect(list.length).to.be.above(0);
                        if (list instanceof Array && list.length > 0) {
                            example = list[0];
                            Object.freeze(example);
                        }
                        done();
                    })
                    .catch(done);
                });

                for(let item of ['title', 'anchor', 'audienceNumber', 'snapshot', 'url', 'platformIcon']) {
                    it(`the info should has the ${item}`, function() {
                        if (example) {
                            expect(example[item]).to.be.ok;
                        } else {
                            this.skip();
                        }
                    });
                }
            });
        }
    });
}
