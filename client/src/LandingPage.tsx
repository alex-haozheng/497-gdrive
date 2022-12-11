import React, { useEffect, useState } from 'react';
import axios from 'axios';


const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileContent = await file.text().then((res: string) => res.slice(1, -1));
        const fileName = file.name.replace(/.txt$/, '');
        await axios.post('http://localhost:4011/files/upload', {
            name : fileName,
            content : fileContent,
        });
        setFile(null);
        setFileList([...fileList, file]);
    };

    return (
        <div>
            <form onSubmit={handleFileSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};


const DownloadButton = ({ fileId, fileName } : { fileId: string, fileName: string }) => {
    const handleDownload = async () => {
        const res = await axios.get(`http://localhost:4011/files/${fileId}/download`);
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(res.data.content)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
    };
    return (
        <button onClick={handleDownload}>Download</button>
    );
};
        
const ListFiles = () => {
    interface File {
        fileId: string;
        name: string;
        size: number;
        tags: string[];
        type: string;
        date: Date;
        content: string;
    }

    const [fileList, setFileList] = useState<File[]>([]);

    useEffect(() => {
        axios.get('http://localhost:4009/files').then((res) => {
            setFileList(res.data.files);
        });
    }, []);    

    return (
        <div>
            <ul>
                {fileList.map((file : File) => {
                    return (
                        <><li key={file.fileId}>
                            <h3>{file.name}</h3>
                            <p>{file.content}</p>
                        </li><DownloadButton fileId={file.fileId} fileName={file.name}/></>
                    );
                })}
            </ul>
        </div>
    );
};

const LandingPage = () => {
    return (
        <div>
            <h1>Upload File</h1>
            <UploadFile />
            <h1>File List</h1>
            <ListFiles />
        </div>
    );              
};

export default LandingPage;