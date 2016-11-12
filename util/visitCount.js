let visitCount = 0;
exports.add = function () {
    visitCount++
};
exports.get = function () {
    return visitCount;
};