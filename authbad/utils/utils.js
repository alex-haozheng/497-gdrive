"use strict";
exports.__esModule = true;
exports.validatePassword = exports.generatePassword = void 0;
var crypto_1 = require("crypto");
var hash_js_1 = require("./hash.js");
function generatePassword(password) {
    var salt = (0, crypto_1.randomBytes)(32).toString('hex');
    var hashedPassword = (0, hash_js_1.hash)(password, salt);
    return {
        hash: hashedPassword,
        salt: salt
    };
}
exports.generatePassword = generatePassword;
function validatePassword(password, hash, salt) {
    return (0, hash_js_1.hash)(password, salt) === hash;
}
exports.validatePassword = validatePassword;
