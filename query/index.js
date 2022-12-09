"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var cors = require("cors");
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
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
        var uId = req.body.uId;
        res.status(200).send({
            'status': uId in userFiles
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get('/user/:uId/files', function (req, res) {
    try {
        var uId = req.params.uId;
        console.log(uId);
        if (uId in userFiles) {
            res.status(200).send({
                files: userFiles[uId]
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
app.get('/user/:uId/files/search', function (req, res) {
    try {
        var uId = req.params.uId;
        var keyword = req.body.keyword;
        if (uId in userFiles) {
            var files = userFiles[uId];
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
        var uId = data.uId;
        userFiles[uId] = [];
    }
    else if (type === 'AccountDeleted') {
        var uId = data.uId;
        delete userFiles[uId];
        res.status(201).json(uId);
    }
    else if (type === 'FileCreated') {
        var uId = data.uId, fileId = data.fileId;
        if (uId in userFiles) {
            userFiles[uId].push(fileId);
            res.status(201).json(uId);
        }
        else {
            res.status(400).json({ message: 'NOT FOUND' });
        }
    }
    else if (type === 'FileDeleted') {
        var uId = data.uId, fileId = data.fileId;
        if (uId in userFiles) {
            delete userFiles[uId][userFiles[uId].indexOf(fileId)];
            res.status(201).json(uId);
        }
        else {
            res.status(400).json({ message: 'NOT FOUND' });
        }
    }
});
app.listen(4007, function () {
    console.log('Listening on 4007');
});
