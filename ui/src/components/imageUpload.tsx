// @ts-ignore
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'
import {Button, Box, Typography, CircularProgress} from "@mui/material";

import '../styles/app.css'
import '../styles/button.css'
import {useState} from "react";
import {BACKEND_URI} from "./constants";

export default function ImageUpload() {

    const [imageArrBuff, setImageArrBuffer] = useState<Uint8Array>();
    const [styleArrBuff, setStyleArrBuffer] = useState<Uint8Array>();
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [resultUri, setResultUri] = useState<string>();


    function setBufferArray(imageFile: { file: Blob | undefined },
                            bufferSetter: (arg: Uint8Array) => (void)) {
        //console.log({imageFile})
        if (imageFile.file === undefined) {
            return
        }

        const fileReader = new FileReader();
        fileReader.onload = event => {
            // @ts-ignore
            const arrayBuffer: ArrayBuffer = event.target.result;
            const array1 = new Uint8Array(arrayBuffer)
            bufferSetter(array1)
        };
        fileReader.readAsArrayBuffer(imageFile.file);
    }

    function submit() {
        if (imageArrBuff === undefined || styleArrBuff === undefined) {
            alert('Must provide both pictures')
            return
        }
        //console.log(`Image = ${imageArrBuff}`)
        //console.log(`Style = ${styleArrBuff}`)

        const promise = fetch(BACKEND_URI, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    'image': Array.from(imageArrBuff),
                    'style': Array.from(styleArrBuff)
                }
            )
        })

        setRequestSent(true)

        promise
            .then(response => response.json())
            .then(data => data.result)
            .then(res => new Uint8Array(res))
            .then(res => res.buffer)
            .then(arrayBuffer => {

                const blob = new Blob([arrayBuffer])
                const srcBlob = URL.createObjectURL(blob);
                setResultUri(srcBlob)
            })

    }

    if (resultUri) {
        return (
            <div className='App-body'>
                <Typography
                sx={{
                    pb: '10px'
                }}
                >
                    Here's your resulting image
                </Typography>
                <Box>
                    <img
                        width="250"
                        height="250"
                        src={resultUri}
                        alt=''
                        style={{
                            borderRadius: '15px'
                        }}
                    />
                </Box>
            </div>
        );
    }

    if (requestSent) {
        return (
            <div className='App-body'>
                <CircularProgress/>
            </div>
        );
    }


    return (
        <div className='App-body'>
            <Box
                sx={{
                    pb: '20px'
                }}
            >
                <Typography
                    variant="subtitle1"
                    component="div"
                >
                    Upload your image
                </Typography>
                <ImageUploader
                    style={{
                        height: 200,
                        width: 200,
                        background: 'rgb(0 182 255)',
                        borderRadius: '15px'
                    }}
                    deleteIcon={
                        <img
                            src='https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png'
                            alt=''
                        />
                    }
                    uploadIcon={
                        <svg
                            className='svg-circleplus'
                            viewBox='0 0 100 100'
                            style={{height: '40px', stroke: '#000'}}
                        >
                            <circle cx='50' cy='50' r='45' fill='none' strokeWidth='7.5'></circle>
                            <line x1='32.5' y1='50' x2='67.5' y2='50' strokeWidth='5'></line>
                            <line x1='50' y1='32.5' x2='50' y2='67.5' strokeWidth='5'></line>
                        </svg>
                    }
                    // @ts-ignore
                    onFileAdded={img => setBufferArray(img, setImageArrBuffer)}
                    //onFileRemoved={}
                />
            </Box>
            <Box
                sx={{
                    pb: '20px'
                }}
            >
                <Typography variant="subtitle1" component="div">
                    Upload style image
                </Typography>
                <ImageUploader
                    style={{
                        height: 200,
                        width: 200,
                        background: 'rgb(0 182 255)',
                        borderRadius: '15px'
                    }}
                    deleteIcon={
                        <img
                            src='https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png'
                            alt=''
                        />
                    }
                    uploadIcon={
                        <svg
                            className='svg-circleplus'
                            viewBox='0 0 100 100'
                            style={{height: '40px', stroke: '#000'}}
                        >
                            <circle cx='50' cy='50' r='45' fill='none' strokeWidth='7.5'></circle>
                            <line x1='32.5' y1='50' x2='67.5' y2='50' strokeWidth='5'></line>
                            <line x1='50' y1='32.5' x2='50' y2='67.5' strokeWidth='5'></line>
                        </svg>
                    }
                    // @ts-ignore
                    onFileAdded={img => setBufferArray(img, setStyleArrBuffer)}
                    //onFileRemoved={}
                />
            </Box
            >
            <Button
                type={"submit"}
                sx={{
                    minWidth: "200px",
                    background: '#01d28e'
                }}
                onClick={submit}
            >
                Let's go
            </Button>
        </div>
    )
}