"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var axios_1 = require("axios");
var app = express();
var utils_js_1 = require("./utils.js");
app.use(express.json());
app.use(cors());
var files = [];
var badfiles = [];
var analytics = {
    numFiles: files.length,
    readabilityDistribution: {},
    badfiles: badfiles
};
setInterval(function () {
    Promise.all([
        axios_1.default.post('http://event-bus:4012/events', {
            type: 'ShootFileAnalytics'
        }),
        axios_1.default.post('http://event-bus:4012/events', {
            type: 'ShootWordAnalytics'
        })
    ]);
    setTimeout(function () {
        var indexes = (0, utils_js_1.processFiles)(files);
        analytics.numFiles = files.length;
        analytics.readabilityDistribution = (0, utils_js_1.condense)(indexes);
        analytics.badfiles = badfiles;
    }, 1000 * 60); // wait for ShootAnalytics events to get to other services, and for GetAnalytics events to come in. No rush, we'll wait one minute. This is a completely backend async service, not worried about responding to client quickly.
}, 1000 * 60 * 60 * 24); // run once a day
app.post('/events', function (req, res) {
    if (req.body.type === 'GetWordAnalytics') {
        badfiles = req.body.data.badfiles;
    }
    else if (req.body.type === 'GetFileAnalytics') {
        files = req.body.data.files;
    }
});
app.get('/analytics', utils_js_1.isAdmin, function (req, res) {
    res.send(analytics);
});
app.listen(4004, function () {
    console.log('Listening on 4004');
});
