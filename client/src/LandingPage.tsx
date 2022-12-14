import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Grid } from '@mui/material';
import EditDocument from './EditDocument';
import * as JSZip from 'jszip';
import * as fs from 'fs';

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
        <Button variant="outlined" color="primary" onClick={handleDownload} sx={{ width:200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 72}} startIcon={<img src="https://img.icons8.com/ios/50/000000/download.png" alt="download" width="20" height="20"/>}>Download</Button>
    );
};

const ZipButton = ( { fileId }: { fileId: string}) => {
    const handleDownload = async () => {
        const res = await axios.get(`http://localhost:4008/user/file/zip`, {
            data: {
                fileId
            }
        });
        const ret = res.data.content;
        var zip = new JSZip();
        zip.file(`${fileId}`, ret.content);
        zip
        .generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('out.zip'))
        .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                console.log("out.zip written.");
        });
    } // what does this do ?
    return (
        <Button variant="outlined" color="primary" onClick={handleDownload} sx={{ width:200, position: 'relative', textTransform: "none", fontFamily: "Helvetica Neue", top: 72}} startIcon={<img src="https://img.icons8.com/ios/50/000000/download.png" alt="download" width="20" height="20"/>}>Zip</Button>
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
                                {file.content.slice(0, 25)}...
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ position: 'relative', top: 70, fontFamily: "Helvetica Neue", color: "grey"}}>
                                Last Modified {file.date.toLocaleString().slice(0, 10)}
                            </Typography>
                            <Button variant="contained" color="success" sx={{ width:200, textTransform: "none", position: 'relative', top: 77, marginBottom: 2}} onClick={() => {window.location.href = `/files/${file.fileId}/edit`}}>Edit</Button>
                            <Button variant="outlined" color="error" sx={{ width:200, textTransform: "none", position: 'relative', top: 73, marginBottom: 2}} onClick={() => {handleDelete(file.fileId)}}>Delete</Button>
                            <DownloadButton fileId={file.fileId} fileName={file.name}/>
                            <ZipButton fileId = {file.fileId} />
                        </Box>
                    );                      
            })}
        </Grid>
    );
};

const LandingPage = () => {
        if ((window.location.pathname === '/files' || window.location.pathname === '/files/*')){
            return ( <div> <UploadFile /> <ListFiles /> </div> );
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