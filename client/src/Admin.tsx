import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import AdminList from './AdminList';
import AdminRequests from './AdminRequests';
import RequestAdminAccess from './RequestAdminAccess';

const Admin = ({ uid, accessToken }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchIsAdmin = async () => {
        const res = await axios.get(`http://localhost:4000/checkAdmin/${uid}/${accessToken}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    useEffect(() => {
      fetchIsAdmin();
    }, []);

    return ( isAdmin ?
        <div>
        <AdminList uid = {uid} accessToken = {accessToken}/>
        <AdminRequests uid = {uid} accessToken = {accessToken}/>
        </div> : 
        <div>
            <RequestAdminAccess uid={uid} />
        </div>
    );
}

export default Admin;