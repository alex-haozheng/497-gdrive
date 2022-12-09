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
var mongodb_1 = require("mongodb");
var logger = require("morgan");
var cors = require("cors");
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
// users : file
var userFiles = {};
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
        var db, query, result, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = mongo.db();
                    return [4 /*yield*/, db.listCollections({ name: 'query' }).hasNext()];
                case 1:
                    if (_a.sent()) {
                        db.collection('query').drop(function (err, delOK) {
                            if (err)
                                throw err;
                            if (delOK)
                                console.log("Collection deleted");
                        });
                        console.log('Collection deleted.');
                    }
                    return [4 /*yield*/, db.listCollections({ name: 'query' }).hasNext()];
                case 2:
                    if (_a.sent()) {
                        console.log('Collection already exists. Skipping initialization.');
                        return [2 /*return*/];
                    }
                    query = db.collection('query');
                    return [4 /*yield*/, query.insertMany([
                            { 'a': [] },
                            { 'b': [] },
                            { 'c': [] },
                        ])];
                case 3:
                    result = _a.sent();
                    console.log("Initialized ".concat(result.insertedCount, " query"));
                    console.log("Initialized:");
                    for (key in result.insertedIds) {
                        console.log("  Inserted user with ID ".concat(result.insertedIds[key]));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getUsers(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, ret;
        return __generator(this, function (_a) {
            query = mongo.db().collection('query');
            result = query.find();
            ret = Object.getOwnPropertyNames(result);
            return [2 /*return*/, ret];
        });
    });
}
function checkUsers(mongo, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result;
        return __generator(this, function (_a) {
            query = mongo.db().collection('query');
            result = query.find();
            return [2 /*return*/, uId in result];
        });
    });
}
function addUser(mongo, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a;
        return __generator(this, function (_b) {
            query = mongo.db().collection('query');
            query.insertOne((_a = {}, _a[uId] = [], _a));
            return [2 /*return*/];
        });
    });
}
function removeUser(mongo, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a;
        return __generator(this, function (_b) {
            query = mongo.db().collection('query');
            return [2 /*return*/, query.updateOne({}, { $unset: (_a = {}, _a[uId] = "", _a) })];
        });
    });
}
function getFiles(mongo, uId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = mongo.db().collection('query');
            return [2 /*return*/, query.findOne()[uId]];
        });
    });
}
function addFile(mongo, uId, fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a;
        return __generator(this, function (_b) {
            query = mongo.db().collection('query');
            return [2 /*return*/, query.updateOne({}, { $push: (_a = {}, _a[uId] = fileId, _a) })];
        });
    });
}
function removeFile(mongo, uId, fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _a;
        return __generator(this, function (_b) {
            query = mongo.db().collection('query');
            return [2 /*return*/, query.updateOne({}, { $pull: (_a = {}, _a[uId] = fileId, _a) })];
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var mongo;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    mongo = _a.sent();
                    return [4 /*yield*/, initDB(mongo)];
                case 2:
                    _a.sent();
                    app.get('/users/list', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, e_1;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 2, , 3]);
                                    _b = (_a = res.status(200)).send;
                                    _d = {};
                                    _c = "files";
                                    return [4 /*yield*/, getUsers(mongo)];
                                case 1:
                                    _b.apply(_a, [(_d[_c] = _e.sent(),
                                            _d)]);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _e.sent();
                                    res.status(500).send(e_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/users/find', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var uId, _a, _b, _c, e_2;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 2, , 3]);
                                    uId = req.body.uId;
                                    _b = (_a = res.status(200)).send;
                                    _d = {};
                                    _c = 'status';
                                    return [4 /*yield*/, checkUsers(mongo, uId)];
                                case 1:
                                    _b.apply(_a, [(_d[_c] = _e.sent(),
                                            _d)]);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _e.sent();
                                    res.status(500).send(e_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/user/:uId/files', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var uId, ret, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    uId = req.params.uId;
                                    return [4 /*yield*/, getFiles(mongo, uId)];
                                case 1:
                                    ret = _a.sent();
                                    res.status(201).json(ret);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_3 = _a.sent();
                                    res.status(500).send(e_3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/events', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, data, uId, uId, ret, uId, fileId, ret, uId, fileId, ret;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, type = _a.type, data = _a.data;
                                    if (!(type === 'AccountCreated')) return [3 /*break*/, 2];
                                    uId = data.uId;
                                    return [4 /*yield*/, addUser(mongo, uId)];
                                case 1:
                                    _b.sent();
                                    res.status(201).json(uId);
                                    return [3 /*break*/, 8];
                                case 2:
                                    if (!(type === 'AccountDeleted')) return [3 /*break*/, 4];
                                    uId = data.uId;
                                    return [4 /*yield*/, removeUser(mongo, uId)];
                                case 3:
                                    ret = _b.sent();
                                    res.status(201).json(ret);
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (!(type === 'FileCreated')) return [3 /*break*/, 6];
                                    uId = data.uId, fileId = data.fileId;
                                    return [4 /*yield*/, addFile(mongo, uId, fileId)];
                                case 5:
                                    ret = _b.sent();
                                    res.status(201).json(ret);
                                    return [3 /*break*/, 8];
                                case 6:
                                    if (!(type === 'FileDeleted')) return [3 /*break*/, 8];
                                    uId = data.uId, fileId = data.fileId;
                                    return [4 /*yield*/, removeFile(mongo, uId, fileId)];
                                case 7:
                                    ret = _b.sent();
                                    res.status(201).json(ret);
                                    _b.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.listen(4007, function () {
                        console.log('Listening on 4007');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();
