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
var logger = require("morgan");
var cors = require("cors");
var axios_1 = require("axios");
var mongodb_1 = require("mongodb");
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
// uid : security question
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
function initDB(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var db, questions, result, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mongo.db();
                    return [4 /*yield*/, db.listCollections({ name: 'questions' }).hasNext()];
                case 1:
                    if (_a.sent()) {
                        db.collection('questions').drop(function (err, delOK) {
                            if (err)
                                throw err;
                            if (delOK)
                                console.log("Collection deleted");
                        });
                        console.log('Collection deleted.');
                    }
                    return [4 /*yield*/, db.listCollections({ name: 'questions' }).hasNext()];
                case 2:
                    if (_a.sent()) {
                        console.log('Collection already exists. Skipping initialization.');
                        return [2 /*return*/];
                    }
                    questions = db.collection('questions');
                    return [4 /*yield*/, questions.insertMany([
                            { uid: 'a', question: 'test' },
                            { uid: 'b', question: 'test' },
                            { uid: 'c', question: 'test' },
                        ])];
                case 3:
                    result = _a.sent();
                    console.log("Initialized ".concat(result.insertedCount, " questions"));
                    console.log("Initialized:");
                    for (key in result.insertedIds) {
                        console.log("  Inserted user with ID ".concat(result.insertedIds[key]));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function initAuthDB(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var auth;
        return __generator(this, function (_a) {
            try {
                auth = mongo.db().collection('auth');
                return [2 /*return*/, auth];
            }
            catch (e) {
                console.log(e);
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
function verify(mongo, uid, question) {
    return __awaiter(this, void 0, void 0, function () {
        var questions, ret;
        return __generator(this, function (_a) {
            questions = mongo.db().collection('questions');
            ret = questions.find({ $and: [{ uid: uid },
                    { question: question }]
            });
            return [2 /*return*/, ret.toArray()];
        });
    });
}
function deleteUser(mongo, uid) {
    return __awaiter(this, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            questions = mongo.db().collection('questions');
            return [2 /*return*/, questions.deleteOne({ uid: uid })];
        });
    });
}
function reset(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            questions = mongo.db().collection('questions');
            return [2 /*return*/, questions.deleteMany({})];
        });
    });
}
function insertQuestion(mongo, uid, question) {
    return __awaiter(this, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            questions = mongo.db().collection('questions');
            return [2 /*return*/, questions.insertOne({ uid: uid, question: question })];
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var mongo, authDB;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    mongo = _a.sent();
                    return [4 /*yield*/, initDB(mongo)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, initAuthDB(mongo)];
                case 3:
                    authDB = _a.sent();
                    // will be used for checking and returning
                    app.get('/verify', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, uid, accessToken, question, otp, user, e_1, ret, e_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, uid = _a.uid, accessToken = _a.accessToken, question = _a.question, otp = _a.otp;
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    if (!uid || !accessToken)
                                        res.status(400).send('Missing Information');
                                    return [4 /*yield*/, authDB.findOne({ uid: uid })];
                                case 2:
                                    user = _b.sent();
                                    if (user === null)
                                        res.status(400).send('User Does Not Exist');
                                    else if (accessToken !== user.accessToken /* || !user.admin */)
                                        res.status(400).send('Unauthorized Access');
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _b.sent();
                                    console.log(e_1);
                                    return [3 /*break*/, 4];
                                case 4:
                                    _b.trys.push([4, 8, , 9]);
                                    if (!(Object.keys(req.body).length !== 3)) return [3 /*break*/, 5];
                                    res.status(400).send({ message: 'BAD REQUEST' });
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, verify(mongo, uid, question)];
                                case 6:
                                    ret = _b.sent();
                                    if (ret.length > 0) {
                                        axios_1.default.post('http://event-bus:4005/events', {
                                            type: 'ChangePassword',
                                            data: {
                                                uid: uid,
                                                accessToken: accessToken,
                                                question: question,
                                                otp: otp
                                            }
                                        });
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(404).send({ message: 'NOT FOUND' });
                                    }
                                    _b.label = 7;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    e_2 = _b.sent();
                                    res.status(500).send(e_2);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/new/user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, uid, accessToken, question, user, e_3, ret, e_4;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, uid = _a.uid, accessToken = _a.accessToken, question = _a.question;
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    if (!uid || !accessToken)
                                        res.status(400).send('Missing Information');
                                    return [4 /*yield*/, authDB.findOne({ uid: uid })];
                                case 2:
                                    user = _b.sent();
                                    if (user === null)
                                        res.status(400).send('User Does Not Exist');
                                    else if (accessToken !== user.accessToken /* || !user.admin */)
                                        res.status(400).send('Unauthorized Access');
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_3 = _b.sent();
                                    console.log(e_3);
                                    return [3 /*break*/, 4];
                                case 4:
                                    _b.trys.push([4, 8, , 9]);
                                    if (!(Object.keys(req.body).length !== 1)) return [3 /*break*/, 5];
                                    res.status(400).send({ message: 'BAD REQUEST' });
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, insertQuestion(mongo, uid, question)];
                                case 6:
                                    ret = _b.sent();
                                    if (ret.acknowledged) {
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(400).send(ret);
                                    }
                                    _b.label = 7;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    e_4 = _b.sent();
                                    res.status(500).send(e_4);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.delete('/reset', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var ret, e_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, reset(mongo)];
                                case 1:
                                    ret = _a.sent();
                                    res.status(201).send(ret);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_5 = _a.sent();
                                    res.status(500).send(e_5);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/events', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, data, uid, ret, uid, accessToken, admin;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, type = _a.type, data = _a.data;
                                    if (!(type === 'AccountDeleted')) return [3 /*break*/, 2];
                                    uid = data.uid;
                                    return [4 /*yield*/, deleteUser(mongo, uid)];
                                case 1:
                                    ret = _b.sent();
                                    if (ret.acknowledged) {
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(400).send(ret);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (type === 'AccountCreated') {
                                        uid = data.uid, accessToken = data.accessToken, admin = data.admin;
                                        authDB.insertOne({ uid: uid, accessToken: accessToken, admin: admin });
                                    }
                                    _b.label = 3;
                                case 3:
                                    res.send({ status: 'ok' });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.listen(4006, function () {
                        console.log('Listening on 4006');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();
