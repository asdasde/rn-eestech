const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/submit-form", (req, res) => {
    console.log("Made it here");
    const data = req.body;
    const filePath = path.join(__dirname, 'public', 'topics.json');
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if(err) {
            console.error(err);
            res.status(500).send('Internal server error');
            return;
        }
        let topics = JSON.parse(fileData);
        if(!Array.isArray(topics)) {
            topics = [];
        }
        topics.push(data);
        fs.writeFile(filePath, JSON.stringify(topics, null, 2), (err) => {
            if(err) {
                console.error(err);
                res.status(500).send('Internal server error');
                return;
            }
            console.log("Data saved successfully");
            res.status(200).json({message: 'Data saved successfully'});
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});