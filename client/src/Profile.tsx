import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

const Profile = (data) => {
    const [username, setUsername] = useState('blank');
    const [name, setName] = useState('blank');
    const [email, setEmail] = useState('blank');
    const [bio, setBio] = useState('blank');
    const [funFact, setFunFact] = useState('blank');

    const [onEdit, setOnEdit] = useState(false);

    const uId = data.uId;

    const fetchProfile = async () => {
        const res = await axios.get(`http://localhost:4002/getProfile/${uId}`);
        setUsername(res.data.uId);
        setName(res.data.name);
        setEmail(res.data.email);
        setBio(res.data.bio);
        setFunFact(res.data.funFact);

        console.log(res.data);
    };

    useEffect(() => {
      fetchProfile();
    }, []);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(onEdit === true){
            const profile = {
                uId, name, email, bio, funFact
            }
            if(profile.uId === ""){
                profile.uId = "blank";
                setUsername("blank");
            }
            if(profile.name === ""){
                profile.name = "blank";
                setName("blank");
            }
            if(profile.email === ""){
                profile.email = "blank";
                setEmail("blank");
            }
            if(profile.bio === ""){
                profile.bio = "blank";
                setBio("blank");
            }
            if(profile.funFact === ""){
                profile.funFact = "blank";
                setFunFact("blank");
            }
            await axios.put(`http://localhost:4002/updateProfile/${uId}/${name}/${email}/${bio}/${funFact}`);
            //setProfile(profile);
            console.log(profile);
        }
        setOnEdit(!onEdit);
    };

    const renderedProfile = 
        ( onEdit ? 
            <div>
                <form onSubmit={onSubmit}>
                    <button className="btn btn-primary">Save</button>
                </form>
                <h3>Username:</h3>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                ></input>

                <h3>Name:</h3>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                ></input>

                <h3>Email:</h3>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                ></input>

                <h3>Bio:</h3>
                <input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="form-control"
                ></input>

                <h3>Fun fact:</h3>
                <input
                    value={funFact}
                    onChange={(e) => setFunFact(e.target.value)}
                    className="form-control"
                ></input>
            </div>
            : 
            <div>
                <form onSubmit={onSubmit}>
                    <button className="btn btn-primary">Edit</button>
                </form>
                <h3>Username: {username}</h3>
                <h3>Name: {name}</h3>
                <h3>Email: {email}</h3>
                <h3>Bio: {bio}</h3>
                <h3>Fun fact: {funFact}</h3>
            </div>
        );

    return (
        <div>
            <h1>Profile</h1>
            <div className="card">
                <div 
                    className="card-body"  
                    style={{ backgroundColor: 'pink', margin: '5%', border: '1px solid black'}}
                >
                    {renderedProfile}
                </div>
            </div>
        </div>

    );
};

export default Profile;