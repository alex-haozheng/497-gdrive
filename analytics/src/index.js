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
var express = require("express");
var cors_1 = require("cors");
var axios_1 = require("axios");
var app = express();
app.use(express.json());
app.use((0, cors_1["default"])());
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next(); // calls next middleware
    }
    else {
        res.status(401).send('Unauthorized access');
    }
}
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    }
    else {
        res.status(401).send('Unauthorized admin access');
    }
}
var data;
// for Justin to add to event-bus
/* app.post('/events', (req, res) => {
    if (req.body.type === 'Analytics') {
        res.send(files);
    }
}); */
setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    var files, badwords, analytics, indexes, _i, files_1, file, sentences, words, letters, L, S, index;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1["default"].post('http://event-bus:4012/events', {
                    type: 'FileAnalytics',
                    data: {}
                })];
            case 1:
                files = (_a.sent()).data.files;
                return [4 /*yield*/, axios_1["default"].post('http://event-bus:4012/events', {
                        type: 'WordAnalytics',
                        data: {}
                    })];
            case 2:
                badwords = (_a.sent()).data.badwords;
                analytics = {
                    numFiles: Object.entries(files).length,
                    readabilityDistribution: {},
                    badwords: badwords.slice()
                };
                indexes = [];
                for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                    file = files_1[_i];
                    sentences = file.content.split("[\\p{Punct}\\s]+");
                    words = file.content.split(/[^a-zA-Z\d]/);
                    letters = words.join('').split('');
                    L = letters.length / words.length * 100;
                    S = sentences.length / letters.length * 100;
                    index = 0.0588 * L - 0.296 * S - 15.8;
                    indexes.push(Math.floor(index));
                }
                indexes.sort(function (a, b) { return a <= b ? -1 : 1; });
                analytics.readabilityDistribution = condense(indexes);
                data = analytics;
                return [2 /*return*/];
        }
    });
}); }, 1000 * 60 * 60 * 24); // run once a day
app.get('/analytics', isAdmin, function (req, res) { });
app.listen(4004, function () {
    console.log('Listening on 4004');
});
