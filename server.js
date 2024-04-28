function updateCounts(topics_json, response_json) {
    // Loop through each element in the response array
    response_json.response.forEach(item => {
        // Extract the sentiment and topic from the current item
        const sentiment = item.sentiment.toUpperCase(); // Convert sentiment to uppercase
        const topic = item.topic;
        const text = item.sentence;

        // Check if the topic exists in the topics_json
        if (topics_json.hasOwnProperty(topic)) {
            // Increment count_positive or count_negative based on sentiment
            if (sentiment === "POSITIVE") {
                topics_json[topic].count_positive++;
                // Add the text to positive_list
                topics_json[topic].positive_list.push(text);
            } else if (sentiment === "NEGATIVE") {
                topics_json[topic].count_negative++;
                // Add the text to negative_list
                topics_json[topic].negative_list.push(text);
            }
        } else {
            // If the topic doesn't exist, add it to topics_json
            topics_json[topic] = { 
                "count_positive": 0, 
                "count_negative": 0, 
                "positive_list": [], 
                "negative_list": [] 
            };
            // Increment count_positive or count_negative based on sentiment
            if (sentiment === "POSITIVE") {
                topics_json[topic].count_positive++;
                // Add the text to positive_list
                topics_json[topic].positive_list.push(text);
            } else if (sentiment === "NEGATIVE") {
                topics_json[topic].count_negative++;
                // Add the text to negative_list
                topics_json[topic].negative_list.push(text);
            }
        }
    });
}


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
        console.log("Data:", data);
        console.log("Topics:", topics);
        updateCounts(topics, data);
        topics = Object.keys(topics).map(key => {
            return {
                topic: key,
                count_positive: topics[key].count_positive,
                count_negative: topics[key].count_negative,
                positive_list: topics[key].positive_list,
                negative_list: topics[key].negative_list
            };
        });
        const string = JSON.stringify(topics, null, 2);
        fs.writeFile(filePath, string, (err) => {
            console.log("Updated topics inside: ", topics);
            console.log("Stringified topics inside: ", JSON.stringify(topics, null, 2));
            if(err) {
                console.error(err);
                res.status(500).send('Internal server error');
                return;
            }
            console.log("Data saved successfully");
            res.status(200).json(topics);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});