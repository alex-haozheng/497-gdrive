import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCard from './AdminCard';

const AdminList = (data) => {
    const [admins, setAdmins] = useState([]);

    const fetchAdmins = async () => {
      const res = await axios.get('http://localhost:4000/getAdmins');
      setAdmins(res.data);
      console.log(res.data);
    };

    useEffect(() => {
      fetchAdmins();
    }, []);

    const onSubmit = async (uidval) => {  
      await axios.delete(`http://localhost:4000/removeAdmin/${uidval}`);

      fetchAdmins();
  };
  
    const renderedAdmins = Object.values(admins).map((p) => {
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
              <AdminCard uid={p} edit={data.edit} onSubmit={() => onSubmit(p)}/>
            </div>
          </div>
        );
    });

    return (
      <div>
        <h1>Admin List</h1>
        <div className="d-flex flex-row flex-wrap justify-content-between">
          {renderedAdmins}
        </div>
      </div>
    );
};

export default AdminList;