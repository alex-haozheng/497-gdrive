import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

import { getProfiles, getProfile, updateProfile, addProfile, deleteProfile } from './database.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const profiles = {};

// Returns all uIds that have a profile
app.get('/profile', async (req, res) => {
    if(
        Object.keys(req.body).length !== 0
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else{
        try{
            const data = await getProfiles();
            const data1 = Object.keys(profiles);
            res.status(201).send({ "data" : data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Returns profile of a specific user
app.get('/profile', async (req, res) => {
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
        res.status(404).send({ message: 'Profile not found' }); 
    } else{
        try{
            const data = await getProfile(uId);
            const data1 = profiles[uId];
            res.status(201).send({ "data": data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Updates a user's profile details
app.put('/profile', async (req, res) => {
    const { uId, name, email, password, bio, funFact } = req.body;
    
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
        typeof password !== "string" ||
        bio === "" ||
        bio === undefined ||
        typeof bio !== "string" ||
        funFact === "" ||
        funFact === undefined ||
        typeof funFact !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        profiles[uId] === undefined
    ){
        res.status(404).send({ message: 'Profile not found' });
    } else{
        try{
            const data = await updateProfile(uId, name, email, password, bio, funFact);
            
            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
            updated["password"] = password;
            updated["bio"] = bio;
            updated["funFact"] = funFact;
            profiles[uId] = updated;
            const data1 = profiles[uId];

            res.status(201).send({ "data" : data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Adds new profile to database
app.post('/profile', async (req, res) => {
    const { uId, name, email, password, bio, funFact } = req.body;
    
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
        typeof password !== "string" ||
        bio === "" ||
        bio === undefined ||
        typeof bio !== "string" ||
        funFact === "" ||
        funFact === undefined ||
        typeof funFact !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        profiles[uId] !== undefined
    ){
        res.status(404).send({ message: 'Profile already exists' });
    } else{
        try{
            const data = await addProfile(uId, name, email, password, bio, funFact);

            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
            updated["password"] = password;
            updated["bio"] = bio;
            updated["funFact"] = funFact;
            profiles[uId] = updated;
            const data1 = profiles[uId];

            res.status(201).send({ "data" : data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Deletes a user's profile from database
app.delete('/profile', async (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( profiles[uId] === undefined ){
        res.status(404).send({ message: 'PROFILE NOT FOUND' });
    } else{
        try{
            await deleteProfile(uId);

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