"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var cors_1 = __importDefault(require("cors"));
var axios_1 = __importDefault(require("axios"));
var app = express();
var auth_js_1 = __importDefault(require("./auth.js"));
app.use(express.json());
app.use((0, cors_1.default)());
var files;
var badfiles;
var analytics = {
    numFiles: files.length,
    readabilityDistribution: {},
    badfiles: badfiles
};
function processFiles() {
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
        var indexes = processFiles();
        analytics.numFiles = files.length;
        analytics.readabilityDistribution = condense(indexes);
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
app.get('/analytics', auth_js_1.default, function (req, res) {
    res.send(analytics);
});
app.listen(4004, function () {
    console.log('Listening on 4004');
});
