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
  
    /* UNCOMMENT IF YOU WANT DATABASE TO NOT RESET EVERY TIME YOU DOCKER COMPOSE UP
    if (await db.listCollections({ name: 'tags' }).hasNext()) {
      console.log('Collection already exists. Skipping initialization.');
      return;
    }
    */

    if (await db.listCollections({ name: 'tags' }).hasNext()) {
      db.collection('tags').drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
      });
      console.log('Collection deleted.');
    }
  
    const tags = db.collection('tags');
    const result = await tags.insertMany([
      { tag: 'school', fileid: 'file0'},
      { tag: 'school', fileid: 'file1'},
      { tag: 'work', fileid: 'file0'},
      { tag: 'personal', fileid: 'file1'},
      { tag: 'personal', fileid: 'file2'}
    ]);
  
    console.log(`Initialized ${result.insertedCount} tags`);
    console.log(`Initialized:`);
  
    for (let key in result.insertedIds) {
      console.log(`  Inserted tags with ID ${result.insertedIds[key]}`);
    }
}

// import { getFiles, getTags, hasTag, addTag, removeTag } from './database.js';
async function getFiles(mongo: MongoClient, tag: String) {
    const tags = mongo.db().collection('tags');
    const result = tags.find({ tag: tag });
    const ret: { tag: String, fileid: String } [] = [];
    await result.forEach((doc) => {
        const cur: { tag: String, fileid: String } = {
            tag: doc.tag,
            fileid: doc.fileid
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

async function fileInDB(mongo: MongoClient, fileid: String) {
    const query: { fileid: String } = { fileid: fileid };
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

async function docHasTag(mongo: MongoClient, tag: String, fileid: String) {
    const query: { tag: String, fileid: String } = { tag: tag, fileid: fileid };
    const tags = mongo.db().collection('tags');
    const result = await tags.count(query);
    return result > 0;
}

async function addTag(mongo: MongoClient, tag: String, fileid: String) {
    const tags = mongo.db().collection('tags');
    tags.insertOne({ tag: tag, fileid: fileid });
    return;
}

async function removeTag(mongo: MongoClient, tag: String, fileid: String) {
    const query: { tag: String, fileid: String } = { tag: tag, fileid: fileid };
    const tags = mongo.db().collection('tags');
    tags.deleteOne(query);
    return;
}

async function removeFile(mongo: MongoClient, fileid: String) {
    const query: { fileid: String } = { fileid: fileid };
    const tags = mongo.db().collection('tags');
    tags.deleteMany(query);
    return;
}

async function start(){
    const mongo = await connectDB();
    await initDB(mongo);

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
        const { tag, fileid } = req.body;
        if(
            Object.keys(req.body).length !== 2||
            tag === "" ||
            tag === undefined ||
            typeof tag !== "string" ||
            fileid === "" ||
            fileid === undefined ||
            typeof fileid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if(
            await docHasTag(mongo, tag, fileid) === true
        ){
            res.status(304).send({ message: 'Doc already tagged with that tag' });
        } else{
            try{
                await addTag(mongo, tag, fileid);                
                res.status(201).send({ message: 'Tag added to doc'});
            } catch (error){
                res.status(500).send({ message: 'INTERNAL SERVER ERROR' });
            }
        }
    });

    app.delete('/removeTag/:tag/:fileid', async (req, res) => {
        const { tag, fileid } = req.params;
        
        if(
            Object.keys(req.params).length !== 2 ||
            tag === "" ||
            tag === undefined ||
            typeof tag !== "string" ||
            fileid === "" ||
            fileid === undefined ||
            typeof fileid !== "string"
        ){
            res.status(400).send({ message: 'BAD REQUEST' });
        } else if( 
            await tagInDB(mongo, tag) === false
        ){
            res.status(404).send({ message: 'Tag does not exist in tags db' });
        } else{
            try{
                await removeTag(mongo, tag, fileid);
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
                    const { fileid } = data;
                    if (
                        fileid === "" ||
                        fileid === undefined ||
                        typeof fileid !== "string"
                    ){
                        res.status(400).send({ message: 'BAD REQUEST' });
                    } else if (
                        await fileInDB(mongo, fileid) === false
                    ){ 
                        res.status(404).send({ message: 'File does not exist in tags db' });
                    } else{
                        await removeFile(mongo, fileid);
                        res.status(201).send({ message: "File deleted" });
                    }
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