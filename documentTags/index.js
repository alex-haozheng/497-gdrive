import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const tags = {};

// Add a tag to a document
app.post('/tag', (req, res) => {
    const { fileId, tag } = req.body;
    
    if(
        Object.keys(req.body).length !== 2 ||
        fileId === "" ||
        fileId === undefined ||
        typeof fileId !== "string" ||
        tag === "" ||
        tag === undefined ||
        typeof tag !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( tags[tag] !== undefined && tags[tag].includes(fileId) ){
        res.status(404).send({ message: 'DOCUMENT ALREADY HAS THAT TAG' });
    }
    else{
        const curDocList = tags[tag];
        if(curDocList === undefined){
            tags[tag] = [fileId];
        } else{
            curDocList.push(fileId);
            tags[tag] = curDocList;
        }

        try{
            res.status(201).send({ message: 'Add a tag to a document'});
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Removes a tag from a document
app.delete('/tag', (req, res) => {
    const { fileId, tag } = req.body;
    
    if(
        Object.keys(req.body).length !== 2 ||
        fileId === "" ||
        fileId === undefined ||
        typeof fileId !== "string" ||
        tag === "" ||
        tag === undefined ||
        typeof tag !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( tags[tag] === undefined ){
        res.status(404).send({ message: 'TAG NOT FOUND' });
    } else if( !tags[tag].includes(fileId) ){
        res.status(404).send({ message: 'DOCUMENT DOES NOT HAVE THAT TAG' });
    } else{
        try{
            const index = tags[tag].indexOf(fileId);
            tags[tag].splice(index, 1);
            if(tags[tag].length === 0){
                delete tags[tag];
            }
            res.status(201).send({ message: "Removed tag from document" });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});  