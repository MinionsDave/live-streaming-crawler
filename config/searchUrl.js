exports.createPandaSearchUrl = function (keyword) {
    return `http://www.panda.tv/ajax_search?order_cond=fans&pageno=1&name=${ keyword }&pagenum=20`;
};

exports.createHuyaSearchUrl = function (keyword) {
    return encodeURI(`http://search.huya.com/?m=Search&do=getSearchContent&q=${keyword}&uid=0&app=11&v=4&typ=-5&rows=40`);
};

exports.createDouyuSearchUrl = function (keyword) {
    return encodeURI(`https://www.douyu.com/search/${keyword}?label=1&type=2`);
};