"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.condense = exports.processFiles = exports.isAdmin = void 0;
function isAdmin(req, res, next) {
    if (req.isAuthenticated !== undefined && req.user !== undefined && req.isAuthenticated() && req.user.admin) {
        next();
    }
    else {
        res.status(401).send('Unauthorized admin access');
    }
}
exports.isAdmin = isAdmin;
function processFiles(files) {
    var indexes = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var sentences = file.content.split('[\\p{Punct}\\s]+');
        var words = file.content.split(/[^a-zA-Z\d]/);
        var letters = words.join('').split('');
        var L = (letters.length / words.length) * 100;
        var S = (sentences.length / letters.length) * 100;
        // uses Coleman-Liau index https://en.wikipedia.org/wiki/Coleman–Liau_index
        // L = avg number of letters per 100 words
        // W = avg number of sentences per 100 words
        // index = 0.0588 * L - 0.296 * S - 15.8;
        var index = 0.0588 * L - 0.296 * S - 15.8;
        indexes.push(Math.floor(index));
    }
    return indexes.map(function (n) { return Math.floor(n); }).sort(function (a, b) { return (a <= b ? -1 : 1); });
}
exports.processFiles = processFiles;
function condense(data) {
    var i = 0;
    var distribution = {};
    while (i < data.length) {
        var j = i;
        while (data[++i] === data[j])
            ;
        distribution[data[j]] = i - j;
    }
    return distribution;
} // condense same data to one point and count. Ex: 1 1 1 1 2 2 2 => { 1: 4, 2: 3 }
exports.condense = condense;
