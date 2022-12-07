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
    const { uId, name, email, bio, funFact } = req.body;
    
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
            const data = await updateProfile(uId, name, email, bio, funFact);
            
            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
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
    const { uId, name, email, bio, funFact } = req.body;
    
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
            const data = await addProfile(uId, name, email, bio, funFact);

            let updated = {};
            updated["uId"] = uId;
            updated["name"] = name;
            updated["email"] = email;
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

// If a user has been deleted, remove user from profile db
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
            if (type === "AccountDeleted") {
                const { uId } = data;
                if (
                    uId === "" ||
                    uId === undefined ||
                    typeof uId !== "string"
                ){
                    res.status(400).send({ message: 'BAD REQUEST' });
                } else if (
                    await checkUser(uId)
                ){ 
                    res.status(404).send({ message: 'USER NOT FOUND IN PROFILE DB' });
                } else{
                    await removeUser(uId);
                    res.status(201).send({ message: "Removed user's profile" });
                }
            }
            res.send({ status: 'OK' });
        } catch (error){
            // Send 500 Error if Internal Server Error
            res.status(500).send({message: 'INTERNAL SERVER ERROR'});
        }
    }
});


app.listen(4002, () => {
    console.log('Listening on port 4002');
});  