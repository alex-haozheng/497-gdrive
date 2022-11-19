import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const admins = {};

// Give a user admin access
app.post('/admin', (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        admins[uId] !== undefined
    ){
        res.status(404).send({ message: 'User is already an admin' });
    } else{
        try{
            admins[uId] = true;
            res.status(201).send({ message: 'User added as an admin'});
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Removes admin access from a user
app.delete('/admin', (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( admins[uId] === undefined ){
        res.status(404).send({ message: 'USER NOT FOUND' });
    } else{
        try{
            delete admins[uId];
            res.status(201).send({ message: "Removed user's admin access" });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});  