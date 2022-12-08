import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.get('/files/:fileId/time', async (req, res) => {
    const { fileId } = req.params;
    const file = await axios.get(`http://localhost:4009/files/${fileId}`);
    res.status(200).send(file.data);
});

app.put('/files/:fileId/time', async (req, res) => {
    const { fileId } = req.params;
    const file = await axios.get(`http://localhost:4009/files/${fileId}`);
    let response = {
        ...file.data,
    };
    response.date = new Date();
    const updatedFile = await axios.put(`http://localhost:4009/files/${fileId}`, response);
    res.status(200).send(updatedFile.data);
});

app.listen(4010, () => {
    console.log('timeLogger service listening on port 4010');
});