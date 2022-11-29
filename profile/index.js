import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const profiles = {};

// Returns all profiles
/*
app.get('/profile', (req, res) => {
    res.send( profiles );
});
*/

// Returns profile of a specific user
app.get('/profile', (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        profiles[uId] === undefined
    ){
        res.status(404).send({ message: 'User not found' }); 
    } else{
        try{
            res.status(201).send( profiles[uId] );
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Updates a user's profile details
app.put('/profile', (req, res) => {
    const { uId, name, email, password } = req.body;
    
    if(
        Object.keys(req.body).length !== 4 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string" ||
        name === "" ||
        name === undefined ||
        typeof name !== "string" ||
        email === "" ||
        email === undefined ||
        typeof email !== "string" ||
        password === "" ||
        password === undefined ||
        typeof password !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        profiles[uId] === undefined
    ){
        res.status(404).send({ message: 'User not found' });
    } else{
        try{
            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
            updated["password"] = password;
            profiles[uId] = updated;

            res.status(201).send( profiles[uId] );
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Adds new profile to database
app.post('/profile', (req, res) => {
    const { uId, name, email, password } = req.body;
    
    if(
        Object.keys(req.body).length !== 4 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string" ||
        name === "" ||
        name === undefined ||
        typeof name !== "string" ||
        email === "" ||
        email === undefined ||
        typeof email !== "string" ||
        password === "" ||
        password === undefined ||
        typeof password !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        profiles[uId] !== undefined
    ){
        res.status(404).send({ message: 'User profile already exists' });
    } else{
        try{
            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
            updated["password"] = password;
            profiles[uId] = updated;

            res.status(201).send( profiles[uId] );
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Deletes a user's profile from database
app.delete('/profile', (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( profiles[uId] === undefined ){
        res.status(404).send({ message: 'USER NOT FOUND' });
    } else{
        try{
            delete profiles[uId];
            res.status(201).send({ message: 'DELETED' });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

app.listen(4002, () => {
    console.log('Listening on port 4002');
});  