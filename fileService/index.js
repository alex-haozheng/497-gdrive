import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import crypto from 'crypto';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const writeToFile = (data) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    parsedFiles.files.push(data);
    fs.writeFileSync('./fileDatabase.json', JSON.stringify(parsedFiles));
};

const readFromFile = () => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    return parsedFiles.files;
};

const readFromFileById = (id) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    return parsedFiles.files.find(file => file.fileId === id);
};

const deleteFile = (id) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    const filteredFiles = parsedFiles.files.filter(file => file.fileId !== id);
    fs.writeFileSync('./fileDatabase.json', JSON.stringify({files: filteredFiles}));
};

const updateFile = (id, data) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    const index = parsedFiles.files.findIndex(file => file.fileId === id);
    parsedFiles.files[index] = data;
    fs.writeFileSync('./fileDatabase.json', JSON.stringify(parsedFiles));
};

/* test code, use only to test file methods locally
console.log(readFromFile());
writeToFile({fileId: 1, fileName: 'test.txt', fileContent: 'This is a test file'});
writeToFile({fileId: 2, fileName: 'test2.txt', fileContent: 'This is a test2 file'});
console.log(readFromFile());
console.log(readFromFileById(1));
deleteFile(1);
console.log(readFromFile());
updateFile(2, {fileId: 2, fileName: 'test2.txt', fileContent: 'This is a test2 file updated'});
console.log(readFromFile());
*/

app.get('/files', (req, res) => {
    try {
        const files = readFromFile();
        res.status(200).send({files});
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/files/:fileId', (req, res) => {
    const file = readFromFileById(req.params.fileId);
    try{
        if(file){
            res.status(200).send(file);
        }
        else{
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/files', (req, res) => {
    const {name, content} = req.body;
    try{
        if(name && content){
            const file = {
                fileId: crypto.randomBytes(8).toString('hex'),
                name: `${name}.txt`,
                size: content.length,
                tags: [],
                type: 'text/plain',
                date: new Date(),
                content,
            };
            writeToFile(file);
            res.status(200).send(file);
        }
        else{
            res.status(400).send('Bad request');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/files/:fileId', (req, res) => {
    const {fileId, content} = req.body;
    //if the file doesn't exist, return 404
    if(!readFromFileById(req.params.fileId)){
        res.status(404).send('File not found');
    }
    if(fileId !== req.params.fileId){
        res.status(400).send('Bad request');
    }
    try{
        if(fileId && content){
            const file = {
                fileId,
                name: `${fileId}.txt`,
                size: content.length,
                tags: [],
                type: 'text/plain',
                //Note: Date() will eventually be seperated and added by timeLogger service
                date: new Date(),
                content,
            };
            updateFile(fileId, file);
            res.status(200).send(file);
        }
        else{
            res.status(400).send('Bad request');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/files/:fileId', (req, res) => {
    try{
        if(readFromFileById(req.params.fileId)){
            deleteFile(req.params.fileId);
            res.status(200).send('File deleted');
        }
        else{
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    if(type === 'FileCreated'){
        axios.post('http://localhost:4005/events', {
            type: 'FileCreated',
            data,
        });
    }
    else if(type === 'FileUpdated'){
        axios.post('http://localhost:4005/events', {
            type: 'FileUpdated',
            data,
        });
    }
    else if(type === 'FileDeleted'){
        axios.post('http://localhost:4005/events', {
            type: 'FileDeleted',
            data,
        });
    }
    res.status(200).send({});
});

app.listen(4009, () => {
    console.log('fileService listening on port 4009');
});