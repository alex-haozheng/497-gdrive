import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

const Profile = (data) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [funFact, setFunFact] = useState('');

    const [onEdit, setOnEdit] = useState(false);

    const uid = data.uid;

    const fetchProfile = async () => {
        const hasProfile = await axios.get(`http://localhost:4002/hasProfile/${uid}`);
        let res;
        if(!hasProfile){
            res = {
                data :{
                    uid: uid,
                    name: "",
                    email: "",
                    bio: "",
                    funFact: ""
                }};
        } else{
            res = await axios.get(`http://localhost:4002/getProfile/${uid}`);
        }
        setUsername(res.data.uid);
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
                uid, name, email, bio, funFact
            }
            if(name === "" || email === "" || bio === "" || funFact === ""){
                console.log("Can not button change because field(s) empty");
            } else{
                const hasProfile = await axios.get(`http://localhost:4002/hasProfile/${uid}`);
                console.log("has profile status"+ hasProfile.data);
                if(hasProfile.data){
                    await axios.put(`http://localhost:4002/updateProfile/${uid}/${name}/${email}/${bio}/${funFact}`);
                } else{
                    await axios.post(`http://localhost:4002/addProfile/${uid}/${name}/${email}/${bio}/${funFact}`);
                }
                setOnEdit(!onEdit);
            }
            //setProfile(profile);
            console.log(profile);
        } else{
            setOnEdit(!onEdit);
        }
    };

    const renderedProfile = 
        ( onEdit ? 
            <div>
                <h3>Must have no empty fields in form to add/update your profile</h3>
                <form onSubmit={onSubmit}>
                    <button className="btn btn-primary">Save</button>
                </form>
                <h3>Username: {uid}</h3>

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
                <h3>Username: {uid}</h3>
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