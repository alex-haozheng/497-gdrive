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

  if (await db.listCollections({ name: 'admins' }).hasNext()) {
    db.collection('admins').drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
    });
    console.log('Collection deleted.');
  }

  if (await db.listCollections({ name: 'admins' }).hasNext()) {
    console.log('Collection already exists. Skipping initialization.');
    return;
  }

  const admins = db.collection('admins');
  const result = await admins.insertMany([
    { uId: 'user0'},
    { uId: 'user1'},
    { uId: 'user2'},
  ]);

  console.log(`Initialized ${result.insertedCount} admins`);
  console.log(`Initialized:`);

  for (let key in result.insertedIds) {
    console.log(`  Inserted user with ID ${result.insertedIds[key]} as an admin`);
  }
}

// import { getAdmins, checkAdmin, addAdmin, removeAdmin } from './database.js';
async function getAdmins(mongo: MongoClient) {
    const admins = mongo.db().collection('admins');
    const result = admins.find();

    const ret: String[] = [];
    await result.forEach((doc) => {
        ret.push(doc.uId);
    });
    return ret;
}

async function checkAdmin(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const admins = mongo.db().collection('admins');
    const result = await admins.count(query);
    return result > 0;
}

async function addAdmin(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const admins = mongo.db().collection('admins');
    admins.insertOne(query);
    return;
}

async function removeAdmin(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const admins = mongo.db().collection('admins');
    admins.deleteOne(query);
    return;
}

async function start() {
    const mongo = await connectDB();
    await initDB(mongo);
    
    app.get('/getAdmins', async (req: Request, res: Response) => {
        if(
            Object.keys(req.body).length !== 0
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const admins = await getAdmins(mongo);
                res.status(201).send(admins);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/checkAdmin/:uId', async (req: Request, res: Response) => {
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
                const check = await checkAdmin(mongo, uId);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.post('/addAdmin', async (req, res) => {
        const { uId } = req.body;
        
        if(
            Object.keys(req.body).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await checkAdmin(mongo, uId)
        ){
            res.status(304).send({ message: 'User is already an admin' });
        } else{
            try{
                await addAdmin(mongo, uId);

                axios.post('http://event-bus:4012/events', {
                    type: 'AdminAdded',
                    data: {
                        uId: uId
                    }
                });
                
                res.status(201).send({ message: 'User added as an admin'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/removeAdmin/:uId', async (req, res) => {
        const uId = req.params.uId;

        if(
            Object.keys(req.params).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST'});
        } else if( 
            !await checkAdmin(mongo, uId) 
        ){
            res.status(304).send({ message: 'User is not an admin' });
        } else{
            try{
                await removeAdmin(mongo, uId);
                
                axios.post('http://event-bus:4012/events', {
                    type: 'AdminRemoved',
                    data: {
                        uId: uId
                    }
                });
                
                res.status(201).send({ message: "Removed user's admin access" });
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

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
                if (type === "AccountDeleted") {
                    const { uId } = data;
                    if (
                        uId === "" ||
                        uId === undefined ||
                        typeof uId !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        !await checkAdmin(mongo, uId)
                    ){ 
                        res.status(304).send({ message: 'User is not an admin' });
                    } else{
                        await removeAdmin(mongo, uId);
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

    app.listen(4000, () => {
        console.log(`Running on 4000.`);
    });
}
    
start();