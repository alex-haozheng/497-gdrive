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
  
    if (await db.listCollections({ name: 'tags' }).hasNext()) {
      db.collection('tags').drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
      });
      console.log('Collection deleted.');
    }
  
    if (await db.listCollections({ name: 'tags' }).hasNext()) {
      console.log('Collection already exists. Skipping initialization.');
      return;
    }
  
    const tags = db.collection('tags');
    const result = await tags.insertMany([
      { tag: 'school', fileId: 'file0'},
      { tag: 'school', fileId: 'file1'},
      { tag: 'work', fileId: 'file0'},
      { tag: 'personal', fileId: 'file1'},
      { tag: 'personal', fileId: 'file2'}
    ]);
  
    console.log(`Initialized ${result.insertedCount} tags`);
    console.log(`Initialized:`);
  
    for (let key in result.insertedIds) {
      console.log(`  Inserted tags with ID ${result.insertedIds[key]}`);
    }
}

async function initAuthDB(mongo) {
	try {
		const auth = mongo.db().collection('auth');
		return auth;
	} catch (e) {
		console.log(e);
		return null;
	}
}

// import { getFiles, getTags, hasTag, addTag, removeTag } from './database.js';
async function getFiles(mongo: MongoClient, tag: String) {
    const tags = mongo.db().collection('tags');
    const result = tags.find({ tag: tag });
    const ret: { tag: String, fileId: String } [] = [];
    await result.forEach((doc) => {
        const cur: { tag: String, fileId: String } = {
            tag: doc.tag,
            fileId: doc.fileId
        };
        ret.push(cur);
    });
    return ret;
}

async function getTags(mongo: MongoClient) {
    const tags = mongo.db().collection('tags');
    const result = tags.find();
    const ret: String[] = [];
    await result.forEach((doc) => {
        if(ret.indexOf(doc.tag) === -1){
            const cur: String = doc.tag;
            ret.push(cur);
        }
    });
    return ret;
}

async function fileInDB(mongo: MongoClient, fileId: String) {
    const query: { fileId: String } = { fileId: fileId };
    const tags = mongo.db().collection('tags');
    const result = await tags.count(query);
    return result > 0;
}


async function tagInDB(mongo: MongoClient, tag: String) {
    const query: { tag: String } = { tag: tag };
    const tags = mongo.db().collection('tags');
    const result = await tags.count(query);
    return result > 0;
}

async function docHasTag(mongo: MongoClient, tag: String, fileId: String) {
    const query: { tag: String, fileId: String } = { tag: tag, fileId: fileId };
    const tags = mongo.db().collection('tags');
    const result = await tags.count(query);
    return result > 0;
}

async function addTag(mongo: MongoClient, tag: String, fileId: String) {
    const tags = mongo.db().collection('tags');
    tags.insertOne({ tag: tag, fileId: fileId });
    return;
}

async function removeTag(mongo: MongoClient, tag: String, fileId: String) {
    const query: { tag: String, fileId: String } = { tag: tag, fileId: fileId };
    const tags = mongo.db().collection('tags');
    tags.deleteOne(query);
    return;
}

async function removeFile(mongo: MongoClient, fileId: String) {
    const query: { fileId: String } = { fileId: fileId };
    const tags = mongo.db().collection('tags');
    tags.deleteMany(query);
    return;
}

async function start(){
    const mongo = await connectDB();
    await initDB(mongo);
    const authDB = await initAuthDB(mongo);

    app.get('/getFiles', async (req: Request, res: Response) => {
        const { tag } = req.body;
        if(
            Object.keys(req.body).length !== 1 ||
            tag === "" ||
            tag === undefined ||
            typeof tag !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await tagInDB(mongo, tag) === false
        ){
            res.status(404).send({ message: 'Tag not in tag database' });
        } else{
            try {
                const check = await getFiles(mongo, tag);
                res.status(201).send(check);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.get('/getTags', async (req: Request, res: Response) => {
        if(
            Object.keys(req.body).length !== 0
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else{
            try {
                const tags = await getTags(mongo);
                res.status(201).send(tags);
            } catch (e) {
                console.log(e);
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.post('/addTag', async (req, res) => {
        const { tag, fileId } = req.body;
        if(
            Object.keys(req.body).length !== 2||
            tag === "" ||
            tag === undefined ||
            typeof tag !== "string" ||
            fileId === "" ||
            fileId === undefined ||
            typeof fileId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await docHasTag(mongo, tag, fileId) === true
        ){
            res.status(304).send({ message: 'Doc already tagged with that tag' });
        } else{
            try{
                await addTag(mongo, tag, fileId);                
                res.status(201).send({ message: 'Tag added to doc'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/removeTag', async (req, res) => {
        const { tag, fileId } = req.body;
        
        if(
            Object.keys(req.body).length !== 2 ||
            tag === "" ||
            tag === undefined ||
            typeof tag !== "string" ||
            fileId === "" ||
            fileId === undefined ||
            typeof fileId !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if( 
            await tagInDB(mongo, tag) === false
        ){
            res.status(404).send({ message: 'Tag does not exist in tags db' });
        } else{
            try{
                await removeTag(mongo, tag, fileId);
                res.status(201).send({ message: "Deleted tag from doc" });
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
                if (type === "FileDeleted") {
                    const { fileId } = data;
                    if (
                        fileId === "" ||
                        fileId === undefined ||
                        typeof fileId !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        await fileInDB(mongo, fileId) === false
                    ){ 
                        res.status(404).send({ message: 'File does not exist in tags db' });
                    } else{
                        await removeFile(mongo, fileId);
                        res.status(201).send({ message: "File deleted" });
                    }
                } else if (type === 'AccountCreated') {
                    const { uid, accessToken, admin }: { uid: string, accessToken: string, admin: boolean } = req.body;
                    authDB.insertOne({ uid, accessToken, admin });
                }
                res.send({ status: 'OK' });
            } catch (error){
                // Send 500 Error if Internal Server Error
                res.status(500).send({message: 'INTERNAL SERVER ERROR'});
            }
        }
    });

    app.listen(4001, () => {
        console.log(`Running on 4001.`);
    });
}

start();