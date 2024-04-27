function sendData(data) {
    const url = 'http://13.13.13.141:5000/generate';  // URL to your Flask API
    fetch(url, {
        method: 'POST',  // or 'GET'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)  // convert data to JSON string
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })  // Parse JSON response
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

const form = document.createElement('form');

const input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json';

const apiUrl = 'http://13.13.13.141:5000/generate';

const files = [];

const button = document.createElement('button');
button.style.padding = '8px 16px';
button.style.margin = '8px';

form.appendChild(input);
form.appendChild(button);
document.body.appendChild(form);

input.addEventListener('change', () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        try {
        const fileData = JSON.parse(event.target.result);
        files.push(fileData);
        } catch(error) {
            console.error(error);
        }
    };
    reader.readAsText(file);
});

const dataResponse = '';

button.addEventListener('click', () => {
    event.preventDefault();
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(files)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Failed to generate file');
        }
        return response.json();
    })
    .then(data => {
        dataResponse = data;
        console.log('Api response: ', data);
    })
    .catch(error => {
        console.error('Error sending API request', error);
    })
});
document.write(dataResponse);