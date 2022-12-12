import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

const AdminRequestCard = (data) => {
    const [profile, setProfile] = useState({uid: 'blank', name: 'blank', email: 'blank', bio: 'blank', funFact: 'blank'});

    const uid = data.uid;

    const fetchProfile = async () => {
        const res = await axios.get(`http://localhost:4002/getProfile/${uid}`);
        setProfile(res.data);
        console.log(res.data);
    };

    useEffect(() => {
      fetchProfile();
    }, []);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        await Promise.all([axios.delete(`http://localhost:4013/removeRequest/${uid}`), axios.post(`http://localhost:4000/addAdmin`, {
            uid: uid
        })]);
    
        fetchProfile();
    };

    const renderedProfile = 
        ( data.edit ?
          <div>
            <form onSubmit={onSubmit}>
                <button className="btn btn-primary">Add as Admin</button>
            </form>
              <h3>Username: {uid}</h3>
              <h3>Name: {profile.name}</h3>
              <h3>Email: {profile.email}</h3>
              <h3>Bio: {profile.bio}</h3>
              <h3>Fun fact: {profile.funFact}</h3>
          </div> :
          <div>
              <h3>Username: {uid}</h3>
              <h3>Name: {profile.name}</h3>
              <h3>Email: {profile.email}</h3>
              <h3>Bio: {profile.bio}</h3>
              <h3>Fun fact: {profile.funFact}</h3>
          </div>
        );

    return (
      <div>
          {renderedProfile}
      </div>
    );
};

export default AdminRequestCard;