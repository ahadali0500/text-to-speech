const fs = require('fs');
const gtts = require('gtts');

// Text you want to convert to speech
const text = "Hello, this is a text to speech conversion using Node.js!";

// Create a gTTS instance
const gttsInstance = new gtts(text, 'en');

// Specify the file name
const fileName = 'output.mp3';

// Save the speech to a file
gttsInstance.save(fileName, (err, result) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(`Speech saved to ${fileName}`);
    }
});
