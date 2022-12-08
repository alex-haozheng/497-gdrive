import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const downloadFile = async (fileId : string) => {
    const file = await axios.get(`http://localhost:4009/files/${fileId}`);
    fs.writeFileSync(`./tempFiles/${fileId}.txt`, JSON.stringify(file.data));
    return file;
}

const uploadFile = async (file : any) => {
    const response = await axios.post('http://localhost:4009/files', file);
    return response;
}

app.get('/files/:fileId/download', async (req, res) => {
    const { fileId } = req.params;
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
});

//this functionality works but will be elaborated on web application front end and as the project progresses
app.post('/files/upload', async (req, res) => {
    const { name, content } = req.body;
    const file = {
        name,
        content
    }
    const response = await uploadFile(file);
    res.status(200).send(response.data);
});

app.listen(4011, () => {
    console.log('uploadDownload service listening on port 4011');
});