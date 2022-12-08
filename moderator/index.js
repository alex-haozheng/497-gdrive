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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var axios_1 = require("axios");
var cors_1 = require("cors");
var mongodb_1 = require("mongodb");
var utils_js_1 = require("./utils.js");
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, mongo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.DATABASE_URL;
                    if (uri === undefined) {
                        throw Error('DATABASE_URL environment variable is not specified');
                    }
                    mongo = new mongodb_1.MongoClient(uri);
                    return [4 /*yield*/, mongo.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve(mongo)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function initBlacklistDB(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var db, blacklist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mongo.db();
                    blacklist = db.collection('blacklist');
                    return [4 /*yield*/, blacklist.insertOne({ key: 'blacklist', blacklist: ['fork', 'raptor', 'java', 'jrk', 'mcboatface'] })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, blacklist];
            }
        });
    });
}
function initBadfilesDB(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var db, badfiles;
        return __generator(this, function (_a) {
            db = mongo.db();
            badfiles = db.collection('badfiles');
            return [2 /*return*/, badfiles];
        });
    });
}
function getBlacklist(blacklistDB) {
    return __awaiter(this, void 0, void 0, function () {
        var blacklistObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blacklistDB.findOne({ key: 'blacklist' })];
                case 1:
                    blacklistObj = _a.sent();
                    return [2 /*return*/, blacklistObj.blacklist || []];
            }
        });
    });
}
function getBadfiles(badfilesDB) {
    return __awaiter(this, void 0, void 0, function () {
        var badfilesObj, badfiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, badfilesDB.find()];
                case 1:
                    badfilesObj = _a.sent();
                    badfiles = [];
                    return [4 /*yield*/, badfilesObj.forEach(function (doc) {
                            badfiles.push({ fileId: doc.fileId, content: doc.content });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, badfiles];
            }
        });
    });
}
var app = express();
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var mongo, blacklistDB, badfilesDB, blacklist;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    mongo = _a.sent();
                    return [4 /*yield*/, initBlacklistDB(mongo)];
                case 2:
                    blacklistDB = _a.sent();
                    return [4 /*yield*/, initBadfilesDB(mongo)];
                case 3:
                    badfilesDB = _a.sent();
                    return [4 /*yield*/, getBlacklist(blacklistDB)];
                case 4:
                    blacklist = _a.sent();
                    app.use(express.json());
                    app.use((0, cors_1.default)());
                    app.post('/events', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, data, file, badfile, _i, _b, fword, _c, blacklist_1, bword, badfiles;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = req.body, type = _a.type, data = _a.data;
                                    file = data.file;
                                    if (!(type === 'FileModified')) return [3 /*break*/, 11];
                                    return [4 /*yield*/, badfilesDB.findOne({ fileId: file.fileId })];
                                case 1:
                                    badfile = _d.sent();
                                    _i = 0, _b = file.content.split(/[^a-zA-Z\d]/);
                                    _d.label = 2;
                                case 2:
                                    if (!(_i < _b.length)) return [3 /*break*/, 10];
                                    fword = _b[_i];
                                    _c = 0, blacklist_1 = blacklist;
                                    _d.label = 3;
                                case 3:
                                    if (!(_c < blacklist_1.length)) return [3 /*break*/, 9];
                                    bword = blacklist_1[_c];
                                    if (!((0, utils_js_1.stringDistance)(fword, bword) / ((fword.length + bword.length) >> 1) <= 0.2)) return [3 /*break*/, 8];
                                    if (!badfile) return [3 /*break*/, 5];
                                    return [4 /*yield*/, badfilesDB.updateOne({ fileId: file.fileId }, { content: file.content })];
                                case 4:
                                    _d.sent();
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, badfilesDB.insertOne({ fileId: file.fileId, content: file.content })];
                                case 6:
                                    _d.sent();
                                    _d.label = 7;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    _c++;
                                    return [3 /*break*/, 3];
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 10: return [3 /*break*/, 13];
                                case 11:
                                    if (!(type === 'ShootWordAnalytics')) return [3 /*break*/, 13];
                                    return [4 /*yield*/, getBadfiles(badfilesDB)];
                                case 12:
                                    badfiles = _d.sent();
                                    axios_1.default.post('http://event-bus:4005/events', {
                                        type: 'GetWordAnalytics',
                                        data: {
                                            files: badfiles
                                        }
                                    });
                                    _d.label = 13;
                                case 13:
                                    res.send({});
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.listen(4005, function () {
                        console.log('Listening on 4005');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();
