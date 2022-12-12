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
    { uid: 'user0'},
    { uid: 'user1'},
    { uid: 'user2'},
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
        ret.push(doc.uid);
    });
    return ret;
}

async function checkAdmin(mongo: MongoClient, uid: String) {
    const query: { uid: String } = { uid: uid };
    const admins = mongo.db().collection('admins');
    const result = await admins.count(query);
    return result > 0;
}

async function addAdmin(mongo: MongoClient, uid: String) {
    const query: { uid: String } = { uid: uid };
    const admins = mongo.db().collection('admins');
    admins.insertOne(query);
    return;
}

async function removeAdmin(mongo: MongoClient, uid: String) {
    const query: { uid: String } = { uid: uid };
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

    app.get('/checkAdmin/:uid', async (req: Request, res: Response) => {
        const uid = req.params.uid;
        if(
            Object.keys(req.params).length !== 1 ||
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const check = await checkAdmin(mongo, uid);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.post('/addAdmin', async (req, res) => {
        const { uid } = req.body;
        
        if(
            Object.keys(req.body).length !== 1 ||
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await checkAdmin(mongo, uid)
        ){
            res.status(304).send({ message: 'User is already an admin' });
        } else{
            try{
                await addAdmin(mongo, uid);

                axios.post('http://event-bus:4012/events', {
                    type: 'AdminAdded',
                    data: {
                        uid: uid
                    }
                });
                
                res.status(201).send({ message: 'User added as an admin'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/removeAdmin/:uid', async (req, res) => {
        const uid = req.params.uid;

        if(
            Object.keys(req.params).length !== 1 ||
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST'});
        } else if( 
            !await checkAdmin(mongo, uid) 
        ){
            res.status(304).send({ message: 'User is not an admin' });
        } else{
            try{
                await removeAdmin(mongo, uid);
                
                axios.post('http://event-bus:4012/events', {
                    type: 'AdminRemoved',
                    data: {
                        uid: uid
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
                    const { uid } = data;
                    if (
                        uid === "" ||
                        uid === undefined ||
                        typeof uid !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        !await checkAdmin(mongo, uid)
                    ){ 
                        res.status(304).send({ message: 'User is not an admin' });
                    } else{
                        await removeAdmin(mongo, uid);
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