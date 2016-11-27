exports.createPandaSearchUrl = function (keyword) {
    return `http://www.panda.tv/ajax_search?order_cond=fans&pageno=1&name=${ keyword }&pagenum=20`;
};