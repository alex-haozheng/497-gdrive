//create ProtectedRoute component
//create a component that will be used to protect routes
//this component will be used to protect routes that require authentication
import React, { Component } from 'react';
import { Navigate, Route } from 'react-router-dom';

//<Route path="/questions" element = {<ProtectedRoute> <Questions uid = {uid} accessToken = {accessToken} /> </ProtectedRoute>} />
//get the uid and accessToken from the prop
//if the uid and accessToken are valid, then render the component
//if the uid and accessToken are not valid, then redirect to the login page
interface ProtectedRouteProp {
    uid: string;
    accessToken: string;
    children: any;
}

export default function ProtectedRoute({uid, accessToken, children}: ProtectedRouteProp) {
    if (uid && accessToken) {
        return children;
    }
    return <Navigate to="/" />;
}