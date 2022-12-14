import express, { Request, Response } from 'express';
import { Db, MongoClient } from 'mongodb';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';

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

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

async function connectDB(): Promise<MongoClient>{
    const uri = process.env.DATABASE_URL;

    if (uri === undefined) {
        throw Error('DATABASE_URL environment variable is not specified');
    }
    
    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
}

async function initDB(mongo: MongoClient) {
    const db = mongo.db();

    if (await db.listCollections({ name: 'files' }).hasNext()) {
        db.collection('files').drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
        });
        console.log('Collection deleted.');
    }

    if (await db.listCollections({ name: 'files' }).hasNext()) {
        console.log('Collection already exists. Skipping initialization.');
        return;
    }

    const files = db.collection('files');

    const result = await files.insertMany([
        { fileId: 'ab03b4c5', name: 'ab03b4c5.txt', size: 44, tags: [], type: 'text/plain', date: '2022-12-12T23:37:39.326Z', content: 'The quick brown fox jumps over the lazy dog.'},
        { fileId: 'd8c06f28519efa8b', name: 'uploadedfile.txt', size: 6, tags: [], type: 'text/plain', date: '2022-12-08T22:52:51.769Z', content: 'sample'},
        { fileId: 'eb76596b5aa7c290', name: 'ab03b4c5 (1).txt.txt', size: 23, tags: [], type: 'text/plain', date: '2022-12-11T04:03:02.638Z', content: '"This is file content."'},
        { fileId: 'e2c9b7639ea927f4', name: 'newfile.txt', size: 13, tags: [], type: 'text/plain', date: '2022-12-12T03:22:18.823Z', content: '"lorem ipsum"'}
    ]);

    console.log(`Initialized ${result.insertedCount} files`);

    console.log(`Initialized:`);

    for (let key in result.insertedIds) {
        console.log(`  Inserted files with ID ${result.insertedIds[key]}`);
    }

    console.log('Done.');

    return;
}

async function getFileById(mongo: MongoClient, fileId: string): Promise<File>{
    const db = mongo.db();
    const files = db.collection('files');
    const file = await files.findOne({ fileId: fileId });
    return {
        fileId: file.fileId,
        name: file.name,
        size: file.size,
        tags: file.tags,
        type: file.type,
        date: file.date,
        content: file.content
    } as File;
}

async function getFiles(mongo: MongoClient): Promise<File[]>{
    const db = mongo.db();
    const files = db.collection('files');
    const file = await files.find().toArray();
    const result: File[] = [];
    for (let i = 0; i < file.length; i++) {
        result.push({
            fileId: file[i].fileId,
            name: file[i].name,
            size: file[i].size,
            tags: file[i].tags,
            type: file[i].type,
            date: file[i].date,
            content: file[i].content
        });
    }
    return result as File[];
}

async function createFile(mongo: MongoClient, file: FileUpload): Promise<File>{
    const db = mongo.db();
    const files = db.collection('files');
    const fileId = crypto.randomBytes(8).toString('hex');
    const result = await files.insertOne({
        fileId: fileId,
        name: file.name,
        size: file.content.length,
        tags: [],
        type: 'text/plain',
        date: new Date(),
        content: file.content
    });
    return await getFileById(mongo, fileId);
}

async function updateFile(mongo: MongoClient, fileId: string, file: FileUpload): Promise<File>{
    const db = mongo.db();
    const files = db.collection('files');
    await files.updateOne({ fileId: fileId }, { $set: { name: file.name, size: file.content.length, content: file.content, date: new Date() } });
    return getFileById(mongo, fileId);
}

async function deleteFile(mongo: MongoClient, fileId: string): Promise<File>{
    const db = mongo.db();
    const files = db.collection('files');
    const file = await getFileById(mongo, fileId);
    await files.deleteOne({ fileId: fileId });
    return file as File;
}

async function start(){
    const mongo = await connectDB();
    await initDB(mongo);
    
    app.get('/files', async (req : express.Request, res : express.Response) => {
        try{
            const files = await getFiles(mongo);
            res.status(200).send({files} as {files: File[]});
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.get('/files/:fileId', async (req : express.Request, res : express.Response) => {
        try {
            const file = await getFileById(mongo, req.params.fileId);
            res.status(200).send(file as File);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.post('/files', async (req : express.Request, res : express.Response) => {
        const {name, content} : FileUpload = req.body;
        try{
            if(name && content){
                const file = await createFile(mongo, {name, content});
                res.status(200).send(file as File);
            }
            else{
                res.status(400).send('Bad request');
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.put('/files/:fileId', async (req : express.Request, res : express.Response) => {
        const {name, content} : FileUpload = req.body;
        try{
            if(name && content){
                const file = await updateFile(mongo, req.params.fileId, {name, content});
                res.status(200).send(file as File);
                axios.post('http://event-bus:4012/events', {
                    type: 'FileUpdated',
                    data: {
                        file: await getFileById(mongo, req.params.fileId) as File
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

    app.delete('/files/:fileId', async (req : express.Request, res : express.Response) => {
        try{
            const file = await deleteFile(mongo, req.params.fileId);
            res.status(200).send(file as File);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });

    app.post('/events', async (req : express.Request, res : express.Response) => {
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
                    files: await getFiles(await connectDB()) as File[]
                },
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
        console.log('new fileSevice listening on port 4009');
    });
}

start();



    



    
