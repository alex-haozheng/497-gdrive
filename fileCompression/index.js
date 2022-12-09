"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var lossless_text_compression_1 = require("lossless-text-compression");
var JSZip = require('jszip');
var app = express();
app.use(express.json());
app.use(cors());
// fileId: compressedContent
var db = {};
app.get('user/:id/file/zip', function (req, res) {
    var fileId = req.body.fileId;
    try {
        if (fileId in db) {
            var zip = new JSZip();
            zip.file(fileId + '.txt', db[fileId]);
            res.status(200);
        }
        else {
            res.status(400).json({ message: 'NOT FOUND' });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.post('/events', function (req, res) {
    var _a = req.body, type = _a.type, data = _a.data;
    if (type === 'FileOpened') {
        try {
            var fileId = data.fileId;
            if (fileId in db) {
                var content = (0, lossless_text_compression_1.decode)(db[fileId]);
                res.status(200).json({ content: content });
            }
            else {
                res.status(400).json({ message: 'NOT FOUND' });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
    else if (type === 'FileModified') {
        try {
            var fileId = data.fileId, content = data.content;
            if (fileId in db) {
                var newContent = (0, lossless_text_compression_1.encode)(content);
                db[fileId] = newContent;
                res.status(201).json('successful compression');
            }
            else {
                res.status(400).json({ message: 'NOT FOUND' });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    }
});
app.listen(4008, function () {
    console.log('Listening on 4008');
});
