"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
// import nodemailer from 'nodemailer';
var nodemailer = require('nodemailer');
var faker_1 = require("@faker-js/faker");
var axios_1 = require("axios");
var app = (0, express_1["default"])();
app.use((0, morgan_1["default"])('dev'));
app.use(express_1["default"].json());
app.use((0, cors_1["default"])());
;
//holds a collection of all emails that are registered
// store uid along with email
var db = {};
// uid: team0.clouddrive@gmail.com
// password: ourpassword
// return the verified emails (used for account creation with existing email)
app.get('/emails', function (req, res) {
    res.send(Object.keys(db));
});
app.get('/login/forgotpw', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid, email, otp, myTransport, mailOptions, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, uid = _a.uid, email = _a.email;
                otp = faker_1.faker.internet.password();
                if (!(uid in db)) {
                    res.status(400).json({
                        message: 'NOT FOUND'
                    });
                    return [2 /*return*/];
                }
                // right around here add a await call to another endpoint to change the password and mark a flag
                return [4 /*yield*/, axios_1["default"].post('http://event-bus:4012/events', {
                        type: "ChangePassword",
                        data: {
                            uid: uid,
                            otp: otp
                        }
                    })];
            case 1:
                // right around here add a await call to another endpoint to change the password and mark a flag
                _b.sent();
                myTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'team0.clouddrive@gmail.com',
                        pass: 'ourpassword'
                    }
                });
                mailOptions = {
                    from: 'team0cloud<team0.clouddrive@gmail.com>',
                    to: email,
                    subject: 'Sending Some Freaking Email',
                    text: "Hello there my sweetling! Let's send some freaking emails!\n Here is your one time password: ".concat(otp) // your email body in plain text format (optional) 
                    // your email body in html format (optional)
                    // if you want to send a customly and amazingly designed html body
                    // instead of a boring plain text, then use this "html" property
                    // instead of "text" property
                    // html: `<h1 style="color: red;text-align:center">Hello there my sweetling!</h1>
                    // 			<p style="text-align:center">Let's send some <span style="color: red">freaking</span> emails!</p>`,
                };
                // sending the email
                myTransport.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log("Email failed to send!");
                        console.error(err);
                    }
                    else {
                        console.log("Email successfully sent!");
                    }
                });
                // should probably change this output later (not necessary)
                res.status(200).json(email);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _b.sent();
                res.status(500).send(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/events', function (req, res) {
    var _a = req.body, type = _a.type, data = _a.data;
    if (type === 'AccountCreated') {
        var uid = data.uid, email = data.email;
        db[uid] = email;
    }
    else if (type === 'AccountDeleted') {
        var uid = data.uid;
        delete db[uid];
    }
    res.send({ status: 'ok' });
});
app.listen(4006, function () {
    console.log('Listening on 4006');
});
