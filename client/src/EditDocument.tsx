import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, createTheme, TextField, ThemeProvider, Typography } from '@mui/material';

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
        handleTextChange(text);
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
    const [wordCount, setWordCount] = useState(0);
    const handleTextChange = (text : string) => {
        const wordCount = text.trim().split(/\s+/).length;
        setWordCount(wordCount);
    };
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" padding={15} sx={{paddingBottom: "5px", paddingTop: "5px"}}>
                    <Button variant="contained" color="success" sx={{marginBottom: "10px", textTransform: "none"}}>
                        Back
                    </Button>
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{fontFamily: "Helvetica Neue"}} fontSize="30px" gutterBottom>
                        {file?.name}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{marginBottom: "10px", textTransform: "none"}} onClick={() => alert("There are " + wordCount + " word(s) in this document.")}>
                        {wordCount} words
                    </Button>
                </Box>
                <Box padding={15} sx={{paddingTop: "0px", paddingBottom: "0px"}}>
                <TextField 
                    id="outlined-multiline-static"
                    multiline={true}
                    rows={30}
                    fullWidth
                    defaultValue={getFileContent()}
                    variant="outlined"
                    onChange={(e) => handleSave(e.target.value)}
                    sx={{fontFamily: "Helvetica Neue", boxShadow: "5"}}
                />
                </Box>
            </ThemeProvider>
        </div>
    );
}

