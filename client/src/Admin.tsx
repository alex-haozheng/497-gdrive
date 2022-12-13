import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import AdminList from './AdminList';
import AdminRequests from './AdminRequests';
import RequestAdminAccess from './RequestAdminAccess';

const Admin = (data) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const uid = data.uid;

    const fetchIsAdmin = async () => {
        const res = await axios.get(`http://localhost:4000/checkAdmin/${uid}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    useEffect(() => {
      fetchIsAdmin();
    }, []);

    const removeMeAdmin = async () => {
        const res = await axios.delete(`http://localhost:4000/removeAdmin/${uid}`);
        const check = await axios.get(`http://localhost:4000/checkAdmin/${uid}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    const addMeAdmin = async () => {
        const res = await axios.post(`http://localhost:4000/addAdmin/${uid}`);
        const check = await axios.get(`http://localhost:4000/checkAdmin/${uid}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    return ( isAdmin ?
        <div>
        <AdminList edit={true}/>
        <AdminRequests edit={true}/>
        <button className="btn btn-primary" onClick={removeMeAdmin}>Remove myself as an admin</button>
        </div> : 
        <div>
            <RequestAdminAccess uid={uid} />
            <h1>You can view your request and current admins list here.</h1>
            <h3>If you have any questions, feel free to contact an admin using their contact info.</h3>
            <h3>Because you are not an admin, you are unable to remove admins / add admins.</h3>
            <AdminList edit={false}/>
            <AdminRequests edit={false}/>
            <button className="btn btn-primary" onClick={addMeAdmin}>Add myself as an admin</button>
        </div>
    );
}

export default Admin;