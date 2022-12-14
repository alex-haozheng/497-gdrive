import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import AdminList from './AdminList';
import AdminRequests from './AdminRequests';
import RequestAdminAccess from './RequestAdminAccess';

const Admin = (data) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [requested, setRequested] = useState(null);

    // const [uid, setuid] = useState('');
    const uid = data.uid;

    // setuid(data.uid);

    const fetchIsAdmin = async () => {
        const res = await axios.get(`http://localhost:4000/checkAdmin/${uid}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    const fetchRequested = async () => {
        const res = await axios.get(`http://localhost:4013/checkRequest/${uid}`);
        setRequested(res.data);
        console.log(res.data);
    }

    useEffect(() => {
      fetchIsAdmin();
      fetchRequested();
    }, []);

    const removeMeAdmin = async () => {
        await axios.delete(`http://localhost:4000/removeAdmin/${uid}`);
        const check = await axios.get(`http://localhost:4000/checkAdmin/${uid}`);
        console.log("This should be false");
        setIsAdmin(false);
    };

    const addMeAdmin = async () => {
        const check = await axios.get(`http://localhost:4013/checkRequest/${uid}`);
        if(check.data){
            await axios.delete(`http://localhost:4013/removeRequest/${uid}`);
        }
        await axios.post(`http://localhost:4000/addAdmin`, {uid: uid});
        console.log("This should be true");
        setIsAdmin(true);
    };

    const onSubmit = async (uid) => {    
        await axios.post(`http://localhost:4013/addRequest`, {
            uid: uid
        });
    
        fetchRequested();
    };

    return ( isAdmin ?
        <div>
        <button className="btn btn-primary" onClick={removeMeAdmin}>Remove myself as an admin</button>
        <h1>You can view current requests and admins list here.</h1>
        <h3>Because you are an admin, you can approve admin requests and remove admin status from current admins.</h3>
        <AdminList edit={true}/>
        <AdminRequests edit={true}/>
        </div> : 
        <div>
            <button className="btn btn-primary" onClick={addMeAdmin}>Force add myself as an admin</button>
            <RequestAdminAccess uid={uid} onSubmit={() => onSubmit(uid)} />
            <h1>You can view your request and current admins list here.</h1>
            <h3>If you have any questions, feel free to contact an admin using their contact info.</h3>
            <h3>Because you are not an admin, you are unable to remove admins / add admins.</h3>
            <AdminList edit={false}/>
            <AdminRequests edit={false}/>
        </div>
    );
}

export default Admin;