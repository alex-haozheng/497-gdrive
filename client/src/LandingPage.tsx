import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, createTheme, TextField, ThemeProvider, Typography, Grid } from '@mui/material';


const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileContent = await file.text();
        const fileName = file.name.replace(/.txt$/, '');
        await axios.post('http://localhost:4011/files/upload', {
            name : fileName,
            content : fileContent,
        });
        setFile(null);
        setFileList([...fileList, file]);
    };

    return (
        <Box sx={{position: 'relative', marginBottom: 3}}>
            <form onSubmit={handleFileSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <input type="file" onChange={handleFileChange} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 50}}/>
                <Button variant="outlined" color="primary" type="submit" sx={{ width:200, position: 'relative', alignItems: 'center', textTransform: "none", fontFamily: "Helvetica Neue"}} startIcon={<img src="https://img.icons8.com/ios/50/000000/upload.png" alt="upload" width="20" height="20"/>}>Upload</Button>
            </form>
        </Box>
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
        <Button variant="outlined" color="primary" onClick={handleDownload} sx={{ width:200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 120}} startIcon={<img src="https://img.icons8.com/ios/50/000000/download.png" alt="download" width="20" height="20"/>}>Download</Button>
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
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            {fileList.map((file : File) => {
                    return (
                        <Box key={file.fileId} sx={{ width: 200, height: 300, bgcolor: 'white', borderRadius: 2, boxShadow: 2, p: 2, m: 2 }}>
                            <Typography variant="h6" component="div" gutterBottom sx={{fontFamily: "Helvetica Neue"}}>
                                {file.name.slice(0, file.name.length - 4)}
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{fontFamily: "Helvetica Neue"}}>
                                {file.content.slice(0, 25)}...
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ position: 'relative', top: 120, fontFamily: "Helvetica Neue", color: "grey"}}>
                                Last Modified {file.date.toLocaleString().slice(0, 10)}
                            </Typography>
                            <Button variant="contained" color="success" sx={{ width:200, textTransform: "none", position: 'relative', top: 125, marginBottom: 2}}>Edit</Button>
                            <DownloadButton fileId={file.fileId} fileName={file.name}/>
                        </Box>
                    );                      
            })}
        </Grid>
    );
};

const LandingPage = () => {
    return (
        <div>
            <UploadFile />
            <ListFiles />
        </div>
    );              
};

export default LandingPage;