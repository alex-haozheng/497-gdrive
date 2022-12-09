import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

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
  
app.get('/files/:fileId/time', async (req : express.Request, res : express.Response) => {
    try{   
        const { fileId } = req.params as { fileId : string };
        const file = await axios.get(`http://localhost:4009/files/${fileId}`) as { data : File };
        res.status(200).send(file.data as File);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/files/:fileId/time', async (req : express.Request, res : express.Response) => {
    try{
        const { fileId } = req.params as { fileId : string };
        const file = await axios.get(`http://localhost:4009/files/${fileId}`) as { data : File };
        let response : File = { ...file.data, };
        response.date = new Date();
        const updatedFile = await axios.put(`http://localhost:4009/files/${fileId}`, response) as { data : File };
        res.status(200).send(updatedFile.data as File);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(4010, () => {
    console.log('timeLogger service listening on port 4010');
});