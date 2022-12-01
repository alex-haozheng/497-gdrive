import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

import { addUser, removeUser, getUsers, checkUser } from './database.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// Delete user action
app.post('/admin/deleteUser', async (req, res) => {
    const { uId } = req.body;
  
    // Send 400 Error if Bad Request 
    if(
      Object.keys(req.body).length !== 1 ||
      uId === "" ||
      uId === undefined ||
      typeof uId !== "string"
    ){
      res.status(400).send({message: 'BAD REQUEST'});
    } else{
      try{
      
        await axios.post('http://event-bus:4012/events', {
          type: "DeleteUser",
          data: {
            uId
          },
        });
      
        res.status(201).send({ message: 'Remove user event message sent'});
      } catch (error){
        // Send 500 Error if Internal Server Error
        res.status(500).send({message: 'INTERNAL SERVER ERROR'});
      }
    }
});

// Remove file action
app.post('/admin/deleteFile', async (req, res) => {
    const { fileId } = req.body;
  
    // Send 400 Error if Bad Request 
    if(
      Object.keys(req.body).length !== 1 ||
      fileId === "" ||
      fileId === undefined ||
      typeof fileId !== "string"
    ){
      res.status(400).send({message: 'BAD REQUEST'});
    } else{
      try{
      
        await axios.post('http://event-bus:4012/events', {
          type: "DeleteFile",
          data: {
            fileId
          },
        });
      
        res.status(201).send({ message: 'Remove file event message sent'});
      } catch (error){
        // Send 500 Error if Internal Server Error
        res.status(500).send({message: 'INTERNAL SERVER ERROR'});
      }
    }
});

// If a user has been deleted, remove user from admins db
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
            if (type === "UserDeleted") {
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
                    res.status(404).send({ message: 'USER NOT FOUND IN ADMINS DB' });
                } else{
                    await removeUser(uId);
                    res.status(201).send({ message: "Removed user's admin access" });
                }
            }
            res.send({ status: 'OK' });
        } catch (error){
            // Send 500 Error if Internal Server Error
            res.status(500).send({message: 'INTERNAL SERVER ERROR'});
        }
    }
});

// Returns if a specific user is an admin or not an admin
app.get('/admin', async (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else {
        try{
            let data = await checkUser(uId);
            res.status(201).send({ data: data });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Returns all users that are admins
app.get('/admin/all', async (req, res) => {    
    if(
        Object.keys(req.body).length !== 0
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else{
        try{
            const data = await getUsers();
            const dataArray = [];
            for(let i = 0; i < data.rows.length; i++){
                dataArray.push(data.rows[i].uid);
            }
            res.status(201).send({ data: dataArray });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Give a user admin access
app.post('/admin', async (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if(
        await checkUser(uId)
    ){
        res.status(304).send({ message: 'User is already an admin' });
    } else{
        try{
            await addUser(uId);
            res.status(201).send({ message: 'User added as an admin'});
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Removes admin access from a user
app.delete('/admin', async (req, res) => {
    const { uId } = req.body;
    
    if(
        Object.keys(req.body).length !== 1 ||
        uId === "" ||
        uId === undefined ||
        typeof uId !== "string"
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else if( 
        !await checkUser(uId) 
    ){
        res.status(304).send({ message: 'User is not an admin' });
    } else{
        try{
            await removeUser(uId);
            res.status(201).send({ message: "Removed user's admin access" });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});  