import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import AdminList from './AdminList';
import AdminRequests from './AdminRequests';
import RequestAdminAccess from './RequestAdminAccess';

const Admin = (data) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const uId = data.uId;

    const fetchIsAdmin = async () => {
        const res = await axios.get(`http://localhost:4000/checkAdmin/${uId}`);
        setIsAdmin(res.data);
        console.log(res.data);
    };

    useEffect(() => {
      fetchIsAdmin();
    }, []);

    return ( isAdmin ?
        <div>
        <AdminList/>
        <AdminRequests/>
        </div> : 
        <div>
            <RequestAdminAccess uId={uId} />
        </div>
    );
}

export default Admin;