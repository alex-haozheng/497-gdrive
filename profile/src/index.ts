import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import logger from 'morgan';
import cors from 'cors';

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
  
    if (await db.listCollections({ name: 'profiles' }).hasNext()) {
      db.collection('profiles').drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
      });
      console.log('Collection deleted.');
    }
  
    if (await db.listCollections({ name: 'profiles' }).hasNext()) {
      console.log('Collection already exists. Skipping initialization.');
      return;
    }
  
    const profiles = db.collection('profiles');
    const result = await profiles.insertMany([
      { uId: 'user0', name: 'Shell', email: 'shell@gmail.com', bio: 'hi my name is shell', funFact: 'i like chips'},
      { uId: 'user1', name: 'Fred', email: 'fred@gmail.com', bio: 'hi my name is fred', funFact: 'i like fruit'},
      { uId: 'user2', name: 'May', email: 'may@gmail.com', bio: 'hi my name is may', funFact: 'spring is my favorite season'},
    ]);
  
    console.log(`Initialized ${result.insertedCount} profiles`);
    console.log(`Initialized:`);
  
    for (let key in result.insertedIds) {
      console.log(`  Inserted profiles with ID ${result.insertedIds[key]}`);
    }
}

// import { getProfiles, getProfile, updateProfile, addProfile, deleteProfile } from './database.js';
async function getProfiles(mongo: MongoClient) {
    const profiles = mongo.db().collection('profiles');
    const result = profiles.find();

    interface PROFILE {
        uId: String,
        name: String,
        email: String,
        bio: String,
        funFact: String
    }
    const ret: PROFILE[] = [];
    await result.forEach((doc) => {
        const cur: PROFILE = {
            uId: doc.uId,
            name: doc.name,
            email: doc.email,
            bio: doc.bio,
            funFact: doc.funFact
        };

        ret.push(
            cur
        );
    });
    return ret;
}

async function getProfile(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const profiles = mongo.db().collection('profiles');
    return profiles.findOne(query);
}

async function hasProfile(mongo: MongoClient, uId: String) {
    const query: { uId: String } = { uId: uId };
    const profiles = mongo.db().collection('profiles');
    const result = await profiles.count(query);
    return result > 0;
}

async function updateProfile(mongo: MongoClient, uId: String, name: String, email: String, bio: String, funFact: String) {
    const profiles = mongo.db().collection('profiles');
    profiles.updateOne({ uId: uId }, { $set: { name: name, email: email, bio: bio, funFact: funFact } });
    return;
}

async function addProfile(mongo: MongoClient, uId: String, name: String, email: String, bio: String, funFact: String) {
    const profiles = mongo.db().collection('profiles');
    profiles.insertOne({ uId: uId, name: name, email: email, bio: bio, funFact: funFact });
    return;
}

async function deleteProfile(mongo: MongoClient, uId: String) {
    const query: { uId: String} = { uId: uId };
    const profiles = mongo.db().collection('profiles');
    profiles.deleteOne(query);
    return;
}

async function start(){
    const mongo = await connectDB();
    await initDB(mongo);

    app.get('/getProfiles', async (req: Request, res: Response) => {
        if(
            Object.keys(req.body).length !== 0
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const profiles = await getProfiles(mongo);
                res.status(201).send(profiles);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/getProfile/:uId', async (req: Request, res: Response) => {
        const uId = req.params.uId;
        console.log(req.params.uId);
        if(
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await hasProfile(mongo, uId) === false
        ){
            res.status(404).send({ message: 'User does not have a profile' });
        } else{
            try {
                const check = await getProfile(mongo, uId);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/hasProfile', async (req: Request, res: Response) => {
        const { uId } = req.body;
        if(
            Object.keys(req.body).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const check = await hasProfile(mongo, uId);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.put('/updateProfile/:uId/:name/:email/:bio/:funFact', async (req, res) => {
        const uId = req.params.uId;
        const name = req.params.name;
        const email = req.params.email;
        const bio = req.params.bio;
        const funFact = req.params.funFact;

        if(
            Object.keys(req.params).length !== 5 ||
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
            await hasProfile(mongo, uId) === false
        ){
            res.status(404).send({ message: 'User does not have a profile' });
        } else{
           try{
                await updateProfile(mongo, uId, name, email, bio, funFact);                
                res.status(201).send({ message: 'Profile updated'});
            } catch (error){
                res.status(500).send(error);
            }
        }
    });

    app.post('/addProfile', async (req, res) => {
        const { uId, name, email, bio, funFact } = req.body;
        if(
            Object.keys(req.body).length !== 5 ||
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
            await hasProfile(mongo, uId) === true
        ){
            res.status(304).send({ message: 'User already has a profile' });
        } else{
            try{
                await addProfile(mongo, uId, name, email, bio, funFact);                
                res.status(201).send({ message: 'Profile added'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/deleteProfile', async (req, res) => {
        const { uId } = req.body;
        
        if(
            Object.keys(req.body).length !== 1 ||
            uId === "" ||
            uId === undefined ||
            typeof uId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if( 
            await hasProfile(mongo, uId) === false
        ){
            res.status(404).send({ message: 'Profile does not exist' });
        } else{
            try{
                await deleteProfile(mongo, uId);
                res.status(201).send({ message: "Deleted profile" });
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
                        await hasProfile(mongo, uId) === false
                    ){ 
                        res.status(404).send({ message: 'Profile does not exist' });
                    } else{
                        await deleteProfile(mongo, uId);
                        res.status(201).send({ message: "Profile deleted" });
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
        console.log(`Running on 4002.`);
    });
}

start();