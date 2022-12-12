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
var mongodb_1 = require("mongodb");
var JSZip = require("jszip");
var fs = require("fs");
var app = express();
app.use(express.json());
app.use(cors());
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
                    return [4 /*yield*/, db.listCollections({ name: 'filecompression' }).hasNext()];
                case 1:
                    if (_a.sent()) {
                        db.collection('filecompression').drop(function (err, delOK) {
                            if (err)
                                throw err;
                            if (delOK)
                                console.log("Collection deleted");
                        });
                        console.log('Collection deleted.');
                    }
                    return [4 /*yield*/, db.listCollections({ name: 'filecompression' }).hasNext()];
                case 2:
                    if (_a.sent()) {
                        console.log('Collection already exists. Skipping initialization.');
                        return [2 /*return*/];
                    }
                    query = db.collection('filecompression');
                    return [4 /*yield*/, query.insertMany([
                            { fileId: 'a', content: 'testtext' },
                            { fileId: 'b', content: 'testtext' },
                            { fileId: 'c', content: 'testtext' }
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
//db crud operations
function insertFile(mongo, fileId, content) {
    return __awaiter(this, void 0, void 0, function () {
        var fc;
        return __generator(this, function (_a) {
            fc = mongo.db().collection('filecompression');
            return [2 /*return*/, fc.insertOne({ fileId: fileId, content: content })];
        });
    });
}
function getFile(mongo, fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var fc;
        return __generator(this, function (_a) {
            fc = mongo.db().collection('filecompression');
            return [2 /*return*/, fc.findOne({ fileId: fileId })];
        });
    });
}
function deleteFile(mongo, fileId, content) {
    return __awaiter(this, void 0, void 0, function () {
        var fc;
        return __generator(this, function (_a) {
            fc = mongo.db().collection('filecompression');
            return [2 /*return*/, fc.deleteOne({ fileId: fileId, content: content })];
        });
    });
}
function modifyFile(mongo, fileId, content) {
    return __awaiter(this, void 0, void 0, function () {
        var fc;
        return __generator(this, function (_a) {
            fc = mongo.db().collection('filecompression');
            return [2 /*return*/, fc.updateOne({ fileId: fileId }, { $set: { content: content } })];
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
                    app.get('/user/file/zip', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var fileId, ret, zip, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fileId = req.body.fileId;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, getFile(mongo, fileId)];
                                case 2:
                                    ret = _a.sent();
                                    if (ret) {
                                        zip = new JSZip();
                                        zip.file("".concat(fileId), ret.content);
                                        zip
                                            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                                            .pipe(fs.createWriteStream('out.zip'))
                                            .on('finish', function () {
                                            // JSZip generates a readable stream with a "end" event,
                                            // but is piped here in a writable stream which emits a "finish" event.
                                            console.log("out.zip written.");
                                        });
                                        res.status(200).send(ret.content);
                                    }
                                    else {
                                        res.status(400).json({ message: 'NOT FOUND' });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    res.status(500).send(e_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/events', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, data, fileId, ret, e_2, fileId, content, ret, e_3, fileId, content, ret, e_4, fileId, content, ret, e_5;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, type = _a.type, data = _a.data;
                                    if (!(type === 'FileOpened')) return [3 /*break*/, 5];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    fileId = data.fileId;
                                    return [4 /*yield*/, getFile(mongo, fileId)];
                                case 2:
                                    ret = _b.sent();
                                    if (ret) {
                                        res.status(200).send(ret.content);
                                    }
                                    else {
                                        res.status(400).json({ message: 'NOT FOUND' });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_2 = _b.sent();
                                    res.status(500).send(e_2);
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 19];
                                case 5:
                                    if (!(type === 'FileModified')) return [3 /*break*/, 10];
                                    _b.label = 6;
                                case 6:
                                    _b.trys.push([6, 8, , 9]);
                                    fileId = data.fileId, content = data.content;
                                    return [4 /*yield*/, modifyFile(mongo, fileId, content)];
                                case 7:
                                    ret = _b.sent();
                                    if (ret.acknowledged) {
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(400).send(ret);
                                    }
                                    return [3 /*break*/, 9];
                                case 8:
                                    e_3 = _b.sent();
                                    res.status(500).send(e_3);
                                    return [3 /*break*/, 9];
                                case 9: return [3 /*break*/, 19];
                                case 10:
                                    if (!(type === 'FileDeleted')) return [3 /*break*/, 15];
                                    _b.label = 11;
                                case 11:
                                    _b.trys.push([11, 13, , 14]);
                                    fileId = data.fileId, content = data.content;
                                    return [4 /*yield*/, deleteFile(mongo, fileId, content)];
                                case 12:
                                    ret = _b.sent();
                                    if (ret.acknowledged) {
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(400).send(ret);
                                    }
                                    return [3 /*break*/, 14];
                                case 13:
                                    e_4 = _b.sent();
                                    res.send(500).send(e_4);
                                    return [3 /*break*/, 14];
                                case 14: return [3 /*break*/, 19];
                                case 15:
                                    if (!(type === 'FileCreated')) return [3 /*break*/, 19];
                                    _b.label = 16;
                                case 16:
                                    _b.trys.push([16, 18, , 19]);
                                    fileId = data.fileId, content = data.content;
                                    return [4 /*yield*/, insertFile(mongo, fileId, content)];
                                case 17:
                                    ret = _b.sent();
                                    if (ret.acknowledged) {
                                        res.status(201).send(ret);
                                    }
                                    else {
                                        res.status(400).send(ret);
                                    }
                                    return [3 /*break*/, 19];
                                case 18:
                                    e_5 = _b.sent();
                                    res.send(500).send(e_5);
                                    return [3 /*break*/, 19];
                                case 19: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.listen(4008, function () {
                        console.log('Listening on 4008');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();
