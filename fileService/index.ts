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

interface File {
    fileId: string;
    name: string;
    size: number;
    tags: string[];
    type: string;
    date: Date;
    content: string;
}

interface FileUpload {
    name: string;
    content: string;
}

type FileEvent = 'FileCreated' | 'FileUpdated' | 'FileDeleted' | 'ShootFileAnalytics' | 'GetFileAnalytics';

interface FileEventMessage {
    type: FileEvent;
    data: File | { files: File[] };
}

const writeToFile = (data : File) => {
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

const readFromFileById = (id : string) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    return parsedFiles.files.find((file: { fileId: string; }) => file.fileId === id);
};

const deleteFile = (id : string) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    const filteredFiles = parsedFiles.files.filter((file: { fileId: any; }) => file.fileId !== id);
    fs.writeFileSync('./fileDatabase.json', JSON.stringify({files: filteredFiles}));
};

const updateFile = (id : string, data : File) => {
    const files = fs.readFileSync('./fileDatabase.json', 'utf8');
    const parsedFiles = JSON.parse(files);
    const index = parsedFiles.files.findIndex((file: { fileId: string; }) => file.fileId === id);
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

app.get('/files', (req : any , res : any) => {
    try {
        const files : File[] = readFromFile();
        res.status(200).send({files} as {files: File[]});
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/files/:fileId', (req : any , res : any) => {
    const file : File = readFromFileById(req.params.fileId);
    try{
        if(file){
            res.status(200).send(file as File);
        }
        else{
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/files', (req : any , res : any) => {
    const {name, content} : FileUpload = req.body;
    try{
        if(name && content){
            const file : File = {
                fileId: crypto.randomBytes(8).toString('hex'),
                name: `${name}.txt`,
                size: content.length,
                tags: [],
                type: 'text/plain',
                date: new Date(),
                content,
            };
            writeToFile(file as File);
            res.status(200).send(file as File);
        }
        else{
            res.status(400).send('Bad request');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/files/:fileId', async (req : any , res : any) => {
    const {fileId, content} : {fileId: string, content: string} = req.body;
    //if the file doesn't exist, return 404
    if(!readFromFileById(req.params.fileId)){
        res.status(404).send('File not found');
    }
    if(fileId !== req.params.fileId){
        res.status(400).send('Bad request');
    }
    try{
        if(fileId && content){
            const file : File = {
                fileId,
                name: `${fileId}.txt`,
                size: content.length,
                tags: [],
                type: 'text/plain',
                date: new Date(),
                content,
            };
            updateFile(fileId, file);
            res.status(200).send(file as File);
            axios.post('http://event-bus:4012/events', {
                type: 'GetFileAnalytics',
                data: {
                    files: await readFromFileById(fileId)
                },
            });
        }
        else{
            res.status(400).send('Bad request');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/files/:fileId', (req : any , res : any) => {
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

app.post('/events', async (req : any , res : any) => {
    const {type, data} : {type: FileEvent, data: File} = req.body;
    if(type === 'FileCreated'){
        axios.post('http://event-bus:4012/events', {
            type: 'FileCreated',
            data,
        } as FileEventMessage);
    }
    if(type === 'ShootFileAnalytics'){
        axios.post('http://event-bus:4012/events', {
            type: 'GetFileAnalytics',
            data: {
                files: await readFromFile() as File[]
            },
        } as FileEventMessage);
    }
    else if(type === 'FileUpdated'){
        axios.post('http://event-bus:4012/events', {
            type: 'FileUpdated',
            data,
        } as FileEventMessage);
    }
    else if(type === 'FileDeleted'){
        axios.post('http://event-bus:4012/events', {
            type: 'FileDeleted',
            data,
        } as FileEventMessage);
    }
    res.status(200).send({});
});

app.listen(4009, () => {
    console.log('fileService listening on port 4009');
});