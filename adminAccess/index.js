import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const admins = {};

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
app.post('/events', (req, res) => {
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
                } else if (admins[uId] === undefined){ 
                    res.status(404).send({ message: 'USER NOT FOUND IN ADMINS DB' });
                } else{
                    delete admins[uId];
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
app.get('/admin', (req, res) => {
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
        try{
            res.status(201).send({ data: true });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    } else{
        try{
        res.status(201).send({ data: false});
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

// Returns all users that are admins
app.get('/admin/all', (req, res) => {    
    if(
        Object.keys(req.body).length !== 0
    ){
        res.status(400).send({ message: 'BAD REQUEST' });
    } else{
        try{
            res.status(201).send({ data: Object.keys(admins) });
        } catch (error){
            res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
        }
    }
});

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
        res.status(404).send({ message: 'USER NOT FOUND IN ADMIN DB' });
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