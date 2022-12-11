import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import logger from 'morgan';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

async function connectDB(): Promise<MongoClient>{
    const uri = process.env.DATABASE_URL;

    if (uri === undefined) {
        throw Error('DATABASE_URL environment variable is not specified');
    }
    
    const mongo = new MongoClient(uri);
    await mongo.connect();
    return await Promise.resolve(mongo);
}

async function initDB(mongo: MongoClient) {
  const db = mongo.db();

  if (await db.listCollections({ name: 'requests' }).hasNext()) {
    db.collection('requests').drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
    });
    console.log('Collection deleted.');
  }

  if (await db.listCollections({ name: 'requests' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }

  const admins = db.collection('requests');
  const result = await admins.insertMany([
    { uId: 'user1'},
    { uId: 'user2'},
  ]);

  console.log(`Initialized ${result.insertedCount} admin requests`);
  console.log(`Initialized:`);

  for (let key in result.insertedIds) {
    console.log(`  Inserted user with ID ${result.insertedIds[key]} as a requestor for admin access`);
  }
}

// import { getRequests, checkRequest, addRequest, removeRequest } from './database.js';
async function getRequests(mongo: MongoClient) {
    const requests = mongo.db().collection('requests');
    const result = requests.find();

    const ret: String[] = [];
    await result.forEach((doc) => {
        ret.push(doc.uId);
    });
    return ret;
}

async function checkRequest(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const requests = mongo.db().collection('requests');
    const result = await requests.count(query);
    return result > 0;
}

async function addRequest(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const requests = mongo.db().collection('requests');
    requests.insertOne(query);
    return;
}

async function removeRequest(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const requests = mongo.db().collection('requests');
    requests.deleteOne(query);
    return;
}

async function start() {
    const mongo = await connectDB();
    await initDB(mongo);
    
    app.get('/getRequests', async (req: Request, res: Response) => {
        if(
            Object.keys(req.body).length !== 0
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const requests = await getRequests(mongo);
                res.status(201).send(requests);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/checkRequest/:uId', async (req: Request, res: Response) => {
        const uId = req.params.uId;
        if(
            Object.keys(req.params).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const check = await checkRequest(mongo, uId);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.post('/addRequest', async (req, res) => {
        const { uId } = req.body;
        
        if(
            Object.keys(req.body).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await checkRequest(mongo, uId)
        ){
            res.status(304).send({ message: 'User has already submitted a pending request for admin access' });
        } else{
            try{
                await addRequest(mongo, uId);
                res.status(201).send({ message: 'Request submitted'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/removeRequest/:uId', async (req, res) => {
        const uId = req.params.uId;

        if(
            Object.keys(req.params).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST'});
        } else if( 
            !await checkRequest(mongo, uId) 
        ){
            res.status(304).send({ message: 'User is not an admin' });
        } else{
            try{
                await removeRequest(mongo, uId);
                res.status(201).send({ message: "Removed request for admin access" });
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    /*
    app.post('/events', async (req, res) => {
        const { type, data } = req.body;
    
        if(
            Object.keys(req.body).length !== 2 ||
            type === "" ||
            type === undefined || 
            typeof type !== "string"
        ){
            res.status(400).send({message: 'BAD REQUEST'});
        } else{
            try{
                if (type === "AdminAdded") {
                    const { uId } = data;
                    if (
                        uId === "" ||
                        uId === undefined ||
                        typeof uId !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        !await checkRequest(mongo, uId)
                    ){ 
                        res.status(304).send({ message: 'There is no pending admin access request from this user' });
                    } else{
                        await removeRequest(mongo, uId);
                        res.status(201).send({ message: "Removed user's admin access request" });
                    }
                }
                res.send({ status: 'OK' });
            } catch (error){
                // Send 500 Error if Internal Server Error
                res.status(500).send({message: 'INTERNAL SERVER ERROR'});
            }
        }
    });
    */

    app.listen(4013, () => {
        console.log(`Running on 4013.`);
    });
}
    
start();