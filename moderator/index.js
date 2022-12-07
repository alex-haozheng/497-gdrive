"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var axios_1 = require("axios");
var cors_1 = require("cors");
var auth_js_1 = require("./auth.js");
var utils_js_1 = require("./utils.js");
var app = express();
app.use(express.json());
app.use((0, cors_1["default"])());
var blacklist = ['fork', 'raptor', 'java', 'jrk', 'mcboatface']; // list of words to disallow from comments
var accepted = 'accepted'; // hard code to prevent mistypes. ideally would import from status file and use globally across all files
var rejected = 'rejected';
var threshold = .2;
app.post('/blacklist/add/:word', auth_js_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        blacklist.push(req.body.word);
        res.status(200).send({});
        return [2 /*return*/];
    });
}); });
app["delete"]('/blacklist/remove/:word', auth_js_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var i;
    return __generator(this, function (_a) {
        i = blacklist.indexOf(req.body.word);
        if (i === -1) {
            res.status(404).send({});
            return [2 /*return*/];
        }
        blacklist.splice(i, 1);
        res.status(200).send({});
        return [2 /*return*/];
    });
}); });
app.put('/blacklist/update/threshold', auth_js_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.body.threshold === undefined) {
            res.status(404).send({});
            return [2 /*return*/];
        }
        threshold = req.body.threshold;
        res.status(200).send({});
        return [2 /*return*/];
    });
}); });
app.post('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, data, status_1, _i, _b, fword, _c, blacklist_1, bword;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, type = _a.type, data = _a.data;
                if (!(type === 'FileCreated' || type === 'FileUpdated')) return [3 /*break*/, 2];
                status_1 = accepted;
                if (data.content === undefined) {
                    res.send({}); //?! do you have to send a response before a return
                    return [2 /*return*/];
                }
                for (_i = 0, _b = data.content.split(/[^a-zA-Z\d]/); _i < _b.length; _i++) { // split file string by punctuation or whitespace
                    fword = _b[_i];
                    for (_c = 0, blacklist_1 = blacklist; _c < blacklist_1.length; _c++) {
                        bword = blacklist_1[_c];
                        if ((0, utils_js_1["default"])(fword, bword) / ((fword.length + bword.length) >> 1) <= threshold) { // strings too similar, status = rejected
                            status_1 = rejected; // status rejected if word from blacklist found in comment
                            break;
                        }
                    }
                }
                return [4 /*yield*/, axios_1["default"].post('http://event-bus:4015/events', {
                        type: 'FileModerated',
                        data: __assign(__assign({}, data), { // spread data object contents
                            status: status_1 })
                    })];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2:
                res.send({});
                return [2 /*return*/];
        }
    });
}); });
app.listen(4003, function () {
    console.log('Listening on 4003');
});
