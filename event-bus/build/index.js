"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var axios_1 = __importDefault(require("axios"));
var app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.post('/events', function (req, res) {
    var event = req.body;
    console.log(req.body.type);
    console.log(req.body.data);
    // yuri's services
    axios_1.default.post('http://admin:4000/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://tag:4001/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://profile:4002/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://requests:4013/events', event).catch(function (err) {
        console.log(err.message);
    });
    // kays service
    axios_1.default.post('http://auth:4003/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://analytics:4004/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://moderator:4005/events', event).catch(function (err) {
        console.log(err.message);
    });
    // alex's service
    axios_1.default.post('http://forgotpw:4006/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://filequery:4007/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://filecompression:4008/events', event).catch(function (err) {
        console.log(err.message);
    });
    // justin's service 
    // TODO
    axios_1.default.post('http://fileservice:4009/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://timelogger:4010/events', event).catch(function (err) {
        console.log(err.message);
    });
    axios_1.default.post('http://uploaddownload:4011/events', event).catch(function (err) {
        console.log(err.message);
    });
    res.send({}); // don't delete. if res doesn't send a response, requests never get satisfied
});
app.listen(4012, function () {
    console.log('Listening on 4012');
});
