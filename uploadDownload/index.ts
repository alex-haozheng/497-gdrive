import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

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

const downloadFile = async (fileId : string) => {
    const file = await axios.get(`http://localhost:4009/files/${fileId}`) as { data : File };
    fs.writeFileSync(`./tempFiles/${fileId}.txt`, JSON.stringify(file.data));
    return file;
}

const uploadFile = async (file : FileUpload) => {
    const response = await axios.post('http://localhost:4009/files', file) as { data : File };
    return response;
}

app.get('/files/:fileId/download', async (req : express.Request, res : express.Response) => {
    try{
        const { fileId } = req.params as { fileId : string };
        await downloadFile(fileId);
        res.download(`./tempFiles/${fileId}.txt`, `${fileId}.txt`, (err) => {
            if (err) {
                console.log(err);
            } else {
                fs.unlink(`./tempFiles/${fileId}.txt`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

//this functionality works but will be elaborated on web application front end and as the project progresses
app.post('/files/upload', async (req : express.Request, res : express.Response) => {
    try{
        const { name, content } : FileUpload = req.body;
        const file : FileUpload = {
            name,
            content
        };
        const response = await uploadFile(file) as { data : File };
        res.status(200).send(response.data as File);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(4011, () => {
    console.log('uploadDownload service listening on port 4011');
});