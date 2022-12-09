"use strict";
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var app = (0, express_1["default"])();
app.use((0, morgan_1["default"])('dev'));
app.use(express_1["default"].json());
app.use((0, cors_1["default"])());
// users : file
var userFiles = {};
app.get('/users/list', function (req, res) {
    try {
        res.status(200).send({
            "files": Object.getOwnPropertyNames(userFiles)
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get('/users/find', function (req, res) {
    try {
        var uid = req.body.uid;
        res.status(200).send({
            'status': uid in userFiles
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get('user/:uid/files', function (req, res) {
    try {
        var uid = req.params.uid.uid;
        res.status(200).send({
            files: userFiles[uid]
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get('user/:uid/files/search', function (req, res) {
    try {
        var uid = req.params.uid.uid;
        var keyword = req.body.keyword;
        if (uid in userFiles) {
            var files = userFiles[uid];
            var arr = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var s = files_1[_i];
                if (s.includes(keyword)) {
                    arr.push(s);
                }
            }
            res.status(200).send({
                result: arr
            });
        }
        else {
            res.status(404).send({
                message: 'NOT FOUND'
            });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.post('/events', function (req, res) {
    var _a = req.body, type = _a.type, data = _a.data;
    if (type === 'AccountCreated') {
        var uid = data.uid;
        userFiles[uid] = [];
    }
    else if (type === 'AccountDeleted') {
        var uid = data.uid;
        delete userFiles[uid];
        res.status(201).json(uid);
    }
    else if (type === 'FileCreated') {
        var uid = data.uid, fileId = data.fileId;
        if (uid in userFiles) {
            userFiles[uid].push(fileId);
            res.status(201).json(uid);
        }
        else {
            res.status(400).json({ message: 'NOT FOUND' });
        }
    }
    else if (type === 'FileDeleted') {
        var uid = data.uid, fileId = data.fileId;
        if (uid in userFiles) {
            delete userFiles[uid][userFiles[uid].indexOf(fileId)];
            res.status(201).json(uid);
        }
        else {
            res.status(400).json({ message: 'NOT FOUND' });
        }
    }
});
app.listen(4007, function () {
    console.log('Listening on 4007');
});
