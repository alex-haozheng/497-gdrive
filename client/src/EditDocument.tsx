import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, createTheme, TextField, ThemeProvider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fontFamily } from '@mui/system';

interface File {
    fileId: string;
    name: string;
    size: number;
    tags: string[];
    type: string;
    date: Date;
    content: string;
}

export default function EditDocument({fileId}) {
    const [file, setFile] = useState<File>();

    useEffect(() => {
        axios.get(`http://localhost:4009/files/${fileId}`)
            .then(res => {
                setFile(res.data); 
            })
            .catch(err => {
                console.log(err);
            })
    }, [fileId]);

    const handleSave = async (text : string) => {   
        await axios.put(`http://localhost:4009/files/${fileId}`, {
            fileId: file.fileId,
            name: file.name,
            size: file.size,
            tags: file.tags,
            type: file.type,
            date: file.date,
            content: text,
            })
            .catch(err => {
                console.log(err);
            });
    };

    const getFileContent = () => {
        if (file) {
            return file.content;
        }
        return '';
    };

    const theme = createTheme({
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
      });

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{fontFamily: "Helvetica Neue"}} fontSize="30px" gutterBottom>
                    {file.name}
                </Typography>
                
                <TextField 
                    id="outlined-multiline-static"
                    multiline
                    defaultValue={getFileContent()}
                    variant="outlined"
                    onChange={(e) => handleSave(e.target.value)}
                />
                <Typography variant="h6" component="div" fontWeight="normal" sx={{fontFamily: "Helvetica Neue"}} fontSize="20px" gutterBottom>
                    Word Count: {getFileContent().split(' ').length}
                </Typography>
            </ThemeProvider>
        </div>
    );
}

