import React, { Component } from 'react';
import { Navigate, Route } from 'react-router-dom';

interface ProtectedRouteProp {
    uid: string;
    accessToken: string;
    children: any;
}

export default function ProtectedRoute({uid, accessToken, children}: ProtectedRouteProp) {
    console.log(`protected route: ${uid}`);
    console.log(`protected route: ${accessToken}`);
    if (uid && accessToken) {
        return children;
    }
    return <Navigate to="/" />;
}