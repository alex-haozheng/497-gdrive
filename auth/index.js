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
var cors = require("cors");
var axios_1 = require("axios");
var crypto_1 = require("crypto");
var mongodb_1 = require("mongodb");
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function hash(password, salt) {
    return (0, crypto_1.pbkdf2Sync)(password, salt, 1000000, 32, 'sha256').toString('hex');
}
function generatePassword(password) {
    var salt = (0, crypto_1.randomBytes)(32).toString('hex');
    var accessToken = (0, crypto_1.randomBytes)(32).toString('hex');
    var hashedPassword = hash(password, salt);
    return {
        hash: hashedPassword,
        salt: salt,
        accessToken: accessToken
    };
}
function validatePassword(password, pwhash, salt) {
    return hash(password, salt) === pwhash;
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, mongo, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
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
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function initDB(mongo) {
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
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var mongo, auth;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    mongo = _a.sent();
                    if (mongo === null)
                        throw Error('Database connection failed');
                    return [4 /*yield*/, initDB(mongo)];
                case 2:
                    auth = _a.sent();
                    if (auth === null)
                        throw Error('Database initialization failed');
                    app.post('/register', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, uid, email, password, _b, hash_1, salt, accessToken;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = req.body, uid = _a.uid, email = _a.email, password = _a.password;
                                    if (!(!uid || !email || !password)) return [3 /*break*/, 1];
                                    res.status(400).send('uid, Email, and Password Required');
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, auth.findOne({ uid: uid })];
                                case 2:
                                    if ((_c.sent()) !== null) {
                                        res.status(400).send('User Already Exists');
                                    }
                                    else {
                                        _b = generatePassword(password), hash_1 = _b.hash, salt = _b.salt, accessToken = _b.accessToken;
                                        auth.insertOne({
                                            uid: uid,
                                            hash: hash_1,
                                            salt: salt,
                                            accessToken: accessToken,
                                            admin: true
                                        });
                                        console.log('Sending Account Created Event...');
                                        axios_1.default.post('http://event-bus:4005/events', {
                                            type: 'AccountCreated',
                                            data: {
                                                uid: req.body.uid,
                                                accessToken: req.body.accessToken
                                            }
                                        });
                                        console.log('Account Created Event Sent');
                                        res.send({ uid: uid, accessToken: accessToken, admin: true });
                                    }
                                    _c.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, uid, password, user;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, uid = _a.uid, password = _a.password;
                                    if (!(!uid || !password)) return [3 /*break*/, 1];
                                    res.status(400).send('Missing Information');
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, auth.findOne({ uid: uid })];
                                case 2:
                                    user = _b.sent();
                                    if (user === null) {
                                        res.status(400).send('Incorrect uid');
                                    }
                                    else if (!validatePassword(password, user.hash, user.salt)) {
                                        res.status(400).send('Incorrect Password');
                                    }
                                    else {
                                        res.status(200).send({ uid: uid, accessToken: user.accessToken, admin: user.admin });
                                    }
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/unregister', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, uid, accessToken, user;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, uid = _a.uid, accessToken = _a.accessToken;
                                    if (!uid || !accessToken) {
                                        res.status(400).send('Missing Information');
                                    }
                                    user = auth.findOne({ uid: uid });
                                    if (!(accessToken !== user.accessToken)) return [3 /*break*/, 1];
                                    res.status(400).send('Unauthorized Access');
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, auth.deleteOne({ _id: uid }, function (err) {
                                        if (err)
                                            console.log(err);
                                        console.log('Successful Account Deletion');
                                    })];
                                case 2:
                                    _b.sent();
                                    console.log('Sending Account Deleted Event...');
                                    axios_1.default.post('http://event-bus:4005/events', {
                                        type: 'AccountDeleted',
                                        data: { uid: uid }
                                    });
                                    console.log('Account Deleted Event Sent');
                                    res.status(200).send('Successfully Deleted Account');
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/events', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var uid, uid, uid, password, _a, hash_2, salt;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(req.body.type === 'AdminAdded')) return [3 /*break*/, 2];
                                    uid = req.body.data.uId;
                                    return [4 /*yield*/, auth.findOneAndUpdate({ uid: uid }, { admin: true })];
                                case 1:
                                    _b.sent();
                                    return [3 /*break*/, 6];
                                case 2:
                                    if (!(req.body.type === 'AdminRemoved')) return [3 /*break*/, 4];
                                    uid = req.body.data.uId;
                                    return [4 /*yield*/, auth.findOneAndUpdate({ uid: uid }, { admin: false })];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 6];
                                case 4:
                                    if (!(req.body.type === 'ChangePassword')) return [3 /*break*/, 6];
                                    uid = req.body.data.uid;
                                    password = req.body.data.otp;
                                    _a = generatePassword(password), hash_2 = _a.hash, salt = _a.salt;
                                    return [4 /*yield*/, auth.findOneAndUpdate({ uid: uid }, { password: hash_2, salt: salt })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    res.send({});
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.listen(4003);
                    return [2 /*return*/];
            }
        });
    });
}
start();
