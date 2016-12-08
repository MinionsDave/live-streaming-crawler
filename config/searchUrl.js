exports.createPandaSearchUrl = function(keyword) {
    return `http://www.panda.tv/ajax_search?order_cond=fans&pageno=1&name=${ keyword }&pagenum=20`;
};

exports.createHuyaSearchUrl = function(keyword) {
    return encodeURI(`http://search.huya.com/?m=Search&do=getSearchContent&q=${keyword}&uid=0&app=11&v=4&typ=-5&rows=40`);
};

exports.createDouyuSearchUrl = function(keyword) {
    return encodeURI(`https://www.douyu.com/search/${keyword}?label=1&type=2`);
};

exports.createQuanminSearchUrl = function() {
    return 'http://www.quanmin.tv/site/search?p=5&rid=-1&rcat=-1&uid=-1&net=0&screen=3&device=rwduvf64prarqwhnzjtjj1s1cl80lcajhvuung25&refer=search&sw=1280&sh=800';
};

exports.createLongzhuSearchUrl = function() {
    return 'http://searchapi.plu.cn/api/search/room';
};

exports.createZhanqiSearchUrl = function(keyword) {
    return encodeURI(`https://www.zhanqi.tv/search?q=${keyword}`);
};
