import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Grid } from '@mui/material';
import EditDocument from './EditDocument';
import JSZip from 'jszip';
import * as fs from 'fs';
import { saveAs } from 'file-saver';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileContent = await file.text();
        const fileName = file.name;
        await axios.post('http://localhost:4011/files/upload', {
            name : fileName,
            content : fileContent,
        }).then(res => {
            window.location.reload();
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
        <Button variant="outlined" color="primary" onClick={handleDownload} sx={{ width:200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 30}} startIcon={<img src="https://img.icons8.com/ios/50/000000/download.png" alt="download" width="20" height="20"/>}>Download</Button>
    );
};

const ZipButton = ( { fileId, fileName } : { fileId: string, fileName: string }) => {
    const handleZip = async () => {
        // How to make this work:
        // TODO 0: do not change the front end code unless specified. it will work once the todo's are completed
        // TODO1: return this code to the fileCompression service
        console.log(`fileId from zip button ${fileId}`);
        console.log(`zipbutton received request`);
        const res = (await axios.get(`http://localhost:4008/user/file/zip`, {
            data: {
                fileId
            }
        })).data;
        var zip = new JSZip();
        // zip.file(`${fileId}`, 'testing testing');
        console.log(fileId);
        zip.file(`${fileId}`, res);
        zip.generateAsync({ type: 'blob' }).then(function (c) {
            saveAs(c, 'file.zip');
        });

        // TODO5: make the handleZip function async
        console.log(`Zip button clicked: ${fileName}`);
    } 
    return (
        <Button variant="outlined" onClick={handleZip} color="secondary" sx={{ width:200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 35}} startIcon={<img src="https://img.icons8.com/ios/50/000000/zip.png" alt="zip" width="20" height="20"/>}>Zip</Button>
    );
};

const handleDelete = async (fileId : string) => {
    await axios.delete(`http://localhost:4009/files/${fileId}`).then((res) => {
        window.location.reload();
    });
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
                                {file.content.length < 25 ? file.content : file.content.slice(0, 25) + "..."}
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ position: 'relative', top: 45, fontFamily: "Helvetica Neue", color: "grey"}}>
                                Last Modified {file.date.toLocaleString().slice(0, 10)}
                            </Typography>
                            <Button variant="contained" color="success" sx={{ width:200, textTransform: "none", position: 'relative', top: 47, marginBottom: 2}} onClick={() => {window.location.href = `/files/${file.fileId}/edit`}}>Edit</Button>
                            <Button variant="outlined" color="error" sx={{ width:200, textTransform: "none", position: 'relative', top: 42, marginBottom: 2}} onClick={() => {handleDelete(file.fileId)}}>Delete</Button>
                            <DownloadButton fileId={file.fileId} fileName={file.name}/>
                            <ZipButton fileId = {file.fileId} fileName = {file.name}/>
                        </Box>
                    );                      
            })}
        </Grid>
    );
};

const LandingPage = () => {
        if ((window.location.pathname === '/files' || window.location.pathname === '/files/*')){
            return (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, m: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, width: '95%', height: 80}}>
                        <Typography variant="h5" component="div" gutterBottom sx={{fontFamily: "Helvetica Neue", fontWeight: "bold"}}>
                            Files
                        </Typography>
                        <UploadFile />
                    </Box>
                    <ListFiles />
                </> 
            )
        }
        else if(window.location.pathname.endsWith('/edit')){
            return  (<EditDocument fileId={window.location.pathname.split('/')[2]}/>);
        }
        else if(window.location.pathname.endsWith('/download')){
            window.location.href = `http://localhost:4009/files/${window.location.pathname.split('/')[2]}/download`;
        }
        else {
            return (<div>404</div>);
        }
};

export default LandingPage;