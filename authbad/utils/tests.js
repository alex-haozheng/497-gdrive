const assert = require('assert');
const generatePassword = require('./utils.js').generatePassword;
const validatePassword = require('./utils.js').validatePassword;
const hash1 = require('./hash.js').hash;


const pw1 = 'password1';
const pw2 = 'password2';
const { hash: hpw1, salt: salt1 } = generatePassword(pw1);
const { hash: hpw2, salt: salt2 } = generatePassword(pw2);

console.log(hpw1);
console.log(hpw2);

assert.equal(hash1(pw1, salt1), hash1(pw1, salt1));
assert.equal(hash1(pw2, salt2), hash1(pw2, salt2));
assert.equal(hash1(pw1, ''), hash1(pw1, ''));
assert.equal(hash1(pw2, ''), hash1(pw2, ''));
assert(validatePassword(pw1, hpw1, salt1));
assert(validatePassword(pw2, hpw2, salt2));
assert(!validatePassword(pw1, hpw2, salt1)); // wrong pw
assert(!validatePassword(pw2, hpw1, salt2)); // wrong pw
assert(!validatePassword(pw1, hpw1, salt2)); // wrong salt
assert(!validatePassword(pw2, hpw2, salt1)); // wrong salt