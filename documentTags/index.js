import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

import { getFiles, removeFile, getTags, addTag, removeTag } from './database.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const tags = {};

// If a file is removed, remove document from tags DB
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    // Send 400 Error if Bad Request (no type string, type of type not string, etc)
    if(
        Object.keys(req.body).length !== 2 ||
        type === "" ||
        type === undefined || 
        typeof type !== "string"
    ){
        res.status(400).send({message: 'BAD REQUEST'});
    } else{
        try{
            if (type === "FileDeleted") {
                const { fileId } = data;
                if (
                    fileId === "" ||
                    fileId === undefined ||
                    typeof fileId !== "string"
                ){
                    res.status(400).send({ message: 'BAD REQUEST' });
                } else{
                    for(let key in tags){
                        if(tags[key].contains(fileId)){
                            let index = tags[key].indexOf(fileId);
                            tags[key].splice(index, 1);
                        }
                    }
                    await removeFile(fileId);
                    res.status(201).send({ message: "Removed file from tags DB" });
                }
            }
            res.send({ status: 'OK' });
        } catch (error){
            // Send 500 Error if Internal Server Error
            res.status(500).send({message: 'INTERNAL SERVER ERROR'});
        }
    }
});

// Return all fileIds tagged with a specific tag
app.get('/tag', async (req, res) => {    
    const { tag } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        tag === "" ||
        tag === undefined ||
        typeof tag !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else{
        const data = await getFiles(tag);
        const data1 = tags[tag];
        if(data1 === undefined){
            data1 = [];
        }

        try{
            res.status(201).send({ data: data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Returns all tags
app.get('/tag/all', async (req, res) => {    
    if(
        Object.keys(req.body).length !== 0
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else{
        try{
            const data = await getTags();
            const data1 = Object.keys(tags);
            res.status(201).send({ data: data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Add a tag to a document
app.post('/tag', async (req, res) => {
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
        await addTag(fileId, tag);

        const curDocList = tags[tag];
        if(curDocList === undefined){
            tags[tag] = [fileId];
        } else{
            curDocList.push(fileId);
            tags[tag] = curDocList;
        }

        try{
            res.status(201).send({ message: 'Added a tag to a document'});
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Removes a tag from a file
app.delete('/tag', async (req, res) => {
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
            await removeTag(fileId, tag);

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

app.listen(4001, () => {
    console.log('Listening on port 4001');
});  