import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

const RequestAdminAccess = (data) => {
    const [requested, setRequested] = useState(false);
    console.log("Request admin access receives");
    console.log(data);
    const uid = data.uid;

    const fetchRequested = async () => {
        const res = await axios.get(`http://localhost:4013/checkRequest/${uid}`);
        setRequested(res.data);
        console.log(res.data);
    };

    useEffect(() => {
      fetchRequested();
    }, []);

    const renderedRequest = 
        (
            <div>
                <h1>Request Admin Access</h1>
                <div 
                    className="card-body"  
                    style={{ backgroundColor: 'pink', margin: '5%', border: '1px solid black'}}
                >
                    <h1>You are not an admin. Click below to request admin access.</h1>
                    <form onSubmit={data.onSubmit}>
                        <button className="btn btn-primary">Send Request</button>
                    </form>
                </div>
            </div>
        );

    const renderedAlreadyRequested = 
        (
            <div>
                <h1>Already Requested Admin Access</h1>
                <div
                    className="card-body"  
                    style={{ backgroundColor: 'pink', margin: '5%', border: '1px solid black'}}
                >
                    <h1>Admin Request Currently Pending.</h1>
                </div>
            </div>
        );

    return ( 
        requested ? <div>{renderedAlreadyRequested}</div> : <div>{renderedRequest}</div> 
    );
};

export default RequestAdminAccess;