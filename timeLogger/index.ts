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

interface timeLog {
    fileId: string;
    date: Date;
    dateStr?: string;
}
  
app.get('/files/:fileId/time', async (req : express.Request, res : express.Response) => {
    try{   
        const { fileId } = req.params as { fileId : string };
        const file = await axios.get(`http://fileservice:4009/files/${fileId}`) as { data : File };
        res.status(200).send({ fileId: file.data.fileId, date: file.data.date } as timeLog);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/files/:fileId/time', async (req : express.Request, res : express.Response) => {
    try{
        const { fileId } = req.params as { fileId : string };
        const file = await axios.get(`http://fileservice:4009/files/${fileId}`) as { data : File };
        let response : File = { ...file.data, };
        response.date = new Date();
        const updatedFile = await axios.put(`http://fileservice:4009/files/${fileId}`, response) as { data : File };
        res.status(200).send({ fileId: updatedFile.data.fileId, date: updatedFile.data.date } as timeLog);
    } catch (err) {
        res.status(500).send(err);
    }
});

const pluralize = (word : string, timeUnit : number) => {
    if(timeUnit === 1){
        return `${word}`;
    }
    return `${word}s`;
};

const parseTime = (file : File) => {
    const now = new Date();
    const time = new Date(file.date);
    const diff = new Date(now.getTime() - time.getTime()).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if(years > 0){
        if(months > 0 && months % 12 !== 0){
            return `${years} ${pluralize('year', years)}, ${months % 12} ${pluralize('month', months % 12)}`;
        }
        return `${years} ${pluralize('year', years)}`;
    }
    if(months > 0){
        if(days > 0 && days % 30 !== 0){
            return `${months} ${pluralize('month', months)}, ${days % 30} ${pluralize('day', days % 30)}`;
        }
        return `${months} ${pluralize('month', months)}`;
    }
    if(days > 0){
        if(hours > 0 && hours % 24 !== 0){
            return `${days} ${pluralize('day', days)}, ${hours % 24} ${pluralize('hour', hours % 24)}`;
        }
        return `${days} ${pluralize('day', days)}`;
    }
    if(hours > 0){
        if(minutes > 0 && minutes % 60 !== 0){
            return `${hours} ${pluralize('hour', hours)}, ${minutes % 60} ${pluralize('minute', minutes % 60)}`;
        }
        return `${hours} ${pluralize('hour', hours)}`;
    }
    if(minutes > 0){
        if(seconds > 0 && seconds % 60 !== 0){
            return `${minutes} ${pluralize('minute', minutes)}, ${seconds % 60} ${pluralize('second', seconds % 60)}`;
        }
        return `${minutes} ${pluralize('minute', minutes)}`;
    }
    return 'now';
};

app.get('/files/:fileId/time/parse', async (req : express.Request, res : express.Response) => {
    try{
        const { fileId } = req.params as { fileId : string };
        const file = await axios.get(`http://fileservice:4009/files/${fileId}`) as { data : File };
        const parsedTime : string = parseTime(file.data);
        res.status(200).send({ fileId, date: file.data.date, dateStr: parsedTime });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.post('/events', (req, res) => {
    res.send({});
});

app.listen(4010, () => {
    console.log('timeLogger service listening on port 4010');
});