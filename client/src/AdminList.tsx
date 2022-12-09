import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);

    const fetchAdmins = async () => {
        const res = await axios.get('http://localhost:4000/admin/all');
        setAdmins(res.data);
        console.log(res.data);
    }

    useEffect(() => {
        fetchAdmins();
    }, []);

    const renderedAdmins = Object.values(admins).map((p) => {
        return (
          <div
            className="card"
            style={{ width: '30%', backgroundColor: 'blue' }}
            key={p}
          >
            <div 
                className="card-body"
                
            >
              <h3
                style={{ margin: '20px', border: 'green 1px solid' }}
              >{p}</h3>
            </div>
          </div>
        );
    });

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
          {renderedAdmins}
          <div>
            HII
          </div>
        </div>
      );
};

export default AdminList;