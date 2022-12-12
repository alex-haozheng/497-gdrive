import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface File {
	fileId: string;
	content: string;
}

interface ReadabilityMap {
    [key: string | number]: number
}

interface Analytics {
	numFiles: number;
	readability: ReadabilityMap;
	badfiles: File[];
}

export default function Analytics({ uid, accessToken }: { uid: string, accessToken: string }) {
	const [numFiles, setNumFiles]: [numFiles: number, setNumFiles: (arg: number) => void] = useState<number>(0);
	const [readability, setReadability]: [readability: ReadabilityMap, setReadability: (arg: ReadabilityMap) => void] = useState<ReadabilityMap>({});
	const [badfiles, setBadfiles]: [badfiles: File[], setBadfiles: (arg: any) => void] = useState<File[]>([]);

	const fetchAnalytics = async () => {
		const analytics: Analytics = (await axios.post(`http://localhost:4004/analytics`, { uid, accessToken })).data;
		console.log('analytics:');
		console.log(analytics);
		setNumFiles(analytics.numFiles);
		setReadability(analytics.readability);
		setBadfiles(analytics.badfiles);
	};

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const renderedReadability = Object.entries(readability).map((p: [string | number, number], i: number) => (<div key={i}>Number of Files in System with Grade Level {p[0]}: {p[1]}</div>));
    const renderedBadfiles = Object.values(badfiles).map((f: File, i: number) => (
    <div key={i}>
        <div>File Id: {f.fileId}</div>
        <div>Content: {f.content}</div>
    </div>));

	return (
        <div>
            <div>NumFiles: {numFiles}</div>
            <div>Readability: {renderedReadability}</div>
            <div>Bad Files: {renderedBadfiles}</div>
        </div>
    );
}
