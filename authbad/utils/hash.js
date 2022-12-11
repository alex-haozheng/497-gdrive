"use strict";
exports.__esModule = true;
exports.hash = void 0;
var crypto_1 = require("crypto");
function hashSimple(password, salt) {
    return (0, crypto_1.createHmac)('sha256', 'secret')
        .update(password + salt)
        .digest('hex');
}
function hashExtreme(password, salt) {
    var hashed = password;
    for (var i = 0; i < 1000000; ++i) {
        hashed = (0, crypto_1.createHmac)('sha256', 'secret')
            .update(hashed + salt)
            .digest('hex');
    }
    return hashed;
}
function hash(password, salt) {
    return (0, crypto_1.pbkdf2Sync)(password, salt, 1000000, 32, 'sha256').toString('hex');
}
exports.hash = hash;
