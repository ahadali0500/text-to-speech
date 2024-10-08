const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const gtts = require('gtts');

const app = express();
const PORT = 3002;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Text to Speech Converter</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    padding: 50px;
                }
                .container {
                    max-width: 600px;
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1, h2 {
                    text-align: center;
                }
                .btn-custom {
                    background-color: #007bff;
                    color: white;
                    width: 100%;
                }
                .btn-custom:hover {
                    background-color: #0056b3;
                }
                footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="mb-4">Text to Speech Converter</h1>
                <form action="/synthesize" method="POST">
                    <div class="mb-3">
                        <textarea class="form-control" name="text" rows="4" placeholder="Enter text here..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-custom">Convert to Speech</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Handle form submission
app.post('/synthesize', (req, res) => {
    const text = req.body.text;
    const gttsInstance = new gtts(text, 'en');
    const fileName = 'output.mp3';

    gttsInstance.save(fileName, (err) => {
        if (err) {
            console.error("Error:", err);
            return res.send("Error occurred while generating speech.");
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Text to Speech Result</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f8f9fa;
                        padding: 50px;
                    }
                    .container {
                        max-width: 600px;
                        background-color: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        text-align: center;
                    }
                    .btn-custom {
                        background-color: #007bff;
                        color: white;
                        width: 100%;
                    }
                    .btn-custom:hover {
                        background-color: #0056b3;
                    }
                    footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="mb-4">Speech Synthesis Complete!</h1>
                    <h2>Input Text:</h2>
                    <p>${text}</p>
                    <audio controls class="w-100">
                        <source src="${fileName}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <br><br>
                    <a href="${fileName}" download class="btn btn-custom">Download MP3</a>
                    <br><br>
                    <a href="/" class="btn btn-outline-secondary w-100">Convert another text</a>
                </div>
            </body>
            </html>
        `);
    });
});

// Serve the MP3 file for download
app.get('/output.mp3', (req, res) => {
    const filePath = __dirname + '/output.mp3';
    res.download(filePath); // Send the file to the client for download
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
