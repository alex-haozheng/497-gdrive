import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminRequestCard from './AdminRequestCard';

const AdminRequests = (data) => {
    const [users, setUsers] = useState([]);

    const fetchRequests = async () => {
      const res = await axios.get('http://localhost:4013/getRequests');
      setUsers(res.data);
      console.log(res.data);
    };

    useEffect(() => {
      fetchRequests();
    }, []);

    const onSubmit = async (uidval) => {
      await Promise.all([axios.delete(`http://localhost:4013/removeRequest/${uidval}`), axios.post(`http://localhost:4000/addAdmin`, {
          uid: uidval
      })]);
  
      fetchRequests();
    };

    const renderedAdminRequests = Object.values(users).map((p) => {
        return (
          <div
            className="card"
            style={{ width: '30%' }}
            key={p}
          >
            <div 
                className="card-body"  
                style={{ backgroundColor: 'pink', margin: '5%', border: '1px solid black'}}
            >
              <AdminRequestCard uid={p} edit={data.edit} onSubmit={() => onSubmit(p)}/>
            </div>
          </div>
        );
    });

    return (
      <div>
        <h1>Admin Requests</h1>
        <div className="d-flex flex-row flex-wrap justify-content-between">
          {renderedAdminRequests}
        </div>
      </div>
    );
};

export default AdminRequests;