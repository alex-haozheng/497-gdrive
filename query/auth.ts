import axios from 'axios';

export async function isAdmin(req, res, next) {
    console.log('isAuth2');
    console.log('Checking Authorization');
    const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
    console.log(`isAuth uid: ${uid}, isAuth accessToken: ${accessToken}`);
    try {
        if (!uid || !accessToken) {
            console.log('1 Missing Information');
            res.status(400).send('Missing Information');
            return;
        }
        const { dbAccessToken, admin } = (await axios.post('http://auth:4003/authData', { uid })).data;
        console.log(`dbAccessToken: ${dbAccessToken}`);
        console.log(`admin: ${admin}`);
        if (!dbAccessToken || !admin) {
            console.log('User does not exist');
            res.status(400).send('User Does Not Exist');
        } else if (accessToken !== dbAccessToken) {
            console.log(`accessToken: ${accessToken} | dbAccessToken: ${dbAccessToken}`);
            console.log(`accessToken === dbAccessToken ${accessToken === dbAccessToken}`);
            console.log(admin);
            res.status(400).send('Unauthorized Access');
        } else {
            next();
        }
    } catch(e) {
        console.log('isAuth Error');
        console.log(e);
    }
}

export async function isAuth(req, res, next) {
    console.log('isAuth2');
    console.log('Checking Authorization');
    const { uid, accessToken }: { uid: string, accessToken: string } = req.body;
    console.log(`isAuth uid: ${uid}, isAuth accessToken: ${accessToken}`);
    try {
        if (!uid || !accessToken) {
            console.log('1 Missing Information');
            res.status(400).send('Missing Information');
            return;
        }
        const { dbAccessToken, admin } = (await axios.post('http://auth:4003/authData', { uid })).data;
        console.log(`dbAccessToken: ${dbAccessToken}`);
        console.log(`admin: ${admin}`);
        if (!dbAccessToken) {
            console.log('User does not exist');
            res.status(400).send('User Does Not Exist');
        } else if (accessToken !== dbAccessToken) {
            console.log(`accessToken: ${accessToken} | dbAccessToken: ${dbAccessToken}`);
            console.log(`accessToken === dbAccessToken ${accessToken === dbAccessToken}`);
            console.log(admin);
            res.status(400).send('Unauthorized Access');
        } else {
            next();
        }
    } catch(e) {
        console.log('isAuth Error');
        console.log(e);
    }
}