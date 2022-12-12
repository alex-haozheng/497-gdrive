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

async function initAuthDB(mongo: MongoClient) {
	try {
		const auth = mongo.db().collection('auth');
		return auth;
	} catch (e) {
		console.log(e);
		return null;
	}
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
      { uid: 'user0', name: 'Shell', email: 'shell@gmail.com', bio: 'hi my name is shell', funFact: 'i like chips'},
      { uid: 'user1', name: 'Fred', email: 'fred@gmail.com', bio: 'hi my name is fred', funFact: 'i like fruit'},
      { uid: 'user2', name: 'May', email: 'may@gmail.com', bio: 'hi my name is may', funFact: 'spring is my favorite season'},
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
        uid: String,
        name: String,
        email: String,
        bio: String,
        funFact: String
    }
    const ret: PROFILE[] = [];
    await result.forEach((doc) => {
        const cur: PROFILE = {
            uid: doc.uid,
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

async function getProfile(mongo: MongoClient, uid: String) {
    const query: { uid: String } = { uid: uid };
    const profiles = mongo.db().collection('profiles');
    return profiles.findOne(query);
}

async function hasProfile(mongo: MongoClient, uid: String) {
    const query: { uid: String } = { uid: uid };
    const profiles = mongo.db().collection('profiles');
    const result = await profiles.count(query);
    return result > 0;
}

async function updateProfile(mongo: MongoClient, uid: String, name: String, email: String, bio: String, funFact: String) {
    const profiles = mongo.db().collection('profiles');
    profiles.updateOne({ uid: uid }, { $set: { name: name, email: email, bio: bio, funFact: funFact } });
    return;
}

async function addProfile(mongo: MongoClient, uid: String, name: String, email: String, bio: String, funFact: String) {
    const profiles = mongo.db().collection('profiles');
    profiles.insertOne({ uid: uid, name: name, email: email, bio: bio, funFact: funFact });
    return;
}

async function deleteProfile(mongo: MongoClient, uid: String) {
    const query: { uid: String} = { uid: uid };
    const profiles = mongo.db().collection('profiles');
    profiles.deleteOne(query);
    return;
}

async function start(){
    const mongo = await connectDB();
    await initDB(mongo);
    const authDB = await initAuthDB(mongo);

    app.get('/getProfiles/:uid/:adminAccess', async (req: Request, res: Response) => {
        if(
            Object.keys(req.body).length !== 2
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

    app.get('/getProfile/:uid/:accessToken', async (req: Request, res: Response) => {
        const { uid, accessToken } = req.params;
		try {
			if (!uid || !accessToken) { res.status(400).send('Missing Information'); return ;}
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
        if(
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await hasProfile(mongo, uid) === false
        ){
            res.status(404).send({ message: 'User does not have a profile' });
        } else{
            try {
                const check = await getProfile(mongo, uid);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/hasProfile/:uid/:accessToken', async (req: Request, res: Response) => {
        const { uid, accessToken } = req.params;
		try {
			if (!uid || !accessToken) { res.status(400).send('Missing Information'); return ;}
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
        if(
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const check = await hasProfile(mongo, uid);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.put('/updateProfile/:uid/:name/:email/:bio/:funFact/:accessToken', async (req, res) => {
        const accessToken = req.params.accessToken;
        const uid = req.params.uid;

		try {
			if (!uid || !accessToken) { res.status(400).send('Missing Information'); return ;}
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
        // const uid = req.params.uid;
        const name = req.params.name;
        const email = req.params.email;
        const bio = req.params.bio;
        const funFact = req.params.funFact;

        if(
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string" ||
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
            await hasProfile(mongo, uid) === false
        ){
            res.status(404).send({ message: 'User does not have a profile' });
        } else{
           try{
                await updateProfile(mongo, uid, name, email, bio, funFact);                
                res.status(201).send({ message: 'Profile updated'});
            } catch (error){
                res.status(500).send(error);
            }
        }
    });

    app.post('/addProfile/:uid/:name/:email/:bio/:funFact/:accessToken', async (req, res) => {
        const { uid, accessToken } = req.params;
		try {
			if (!uid || !accessToken) { res.status(400).send('Missing Information'); return ;}
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
        const { name, email, bio, funFact } = req.params;
        if(
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string" ||
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
            await hasProfile(mongo, uid) === true
        ){
            res.status(304).send({ message: 'User already has a profile' });
        } else{
            try{
                await addProfile(mongo, uid, name, email, bio, funFact);                
                res.status(201).send({ message: 'Profile added'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/deleteProfile/:uid/:accessToken', async (req, res) => {
        const { uid, accessToken } = req.params;
		try {
			if (!uid || !accessToken) { res.status(400).send('Missing Information'); return ;}
			const user = await authDB.findOne({ uid });
			if (user === null) res.status(400).send('User Does Not Exist');
			else if (accessToken !== user.accessToken /* || !user.admin */) res.status(400).send('Unauthorized Access');
		} catch(e) {
			console.log(e);
		}
        
        if(
            uid === "" ||
            uid === undefined ||
            typeof uid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if( 
            await hasProfile(mongo, uid) === false
        ){
            res.status(404).send({ message: 'Profile does not exist' });
        } else{
            try{
                await deleteProfile(mongo, uid);
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
                    const { uid } = data;
                    if (
                        uid === "" ||
                        uid === undefined ||
                        typeof uid !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        await hasProfile(mongo, uid) === false
                    ){ 
                        res.status(404).send({ message: 'Profile does not exist' });
                    } else{
                        await deleteProfile(mongo, uid);
                        res.status(201).send({ message: "Profile deleted" });
                    }
                } else if (type === 'AccountCreated') {
                    const { uid, accessToken, admin }: { uid: string, accessToken: string, admin: boolean } = req.body.data;
                    authDB.insertOne({ uid, accessToken, admin });
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