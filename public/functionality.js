function update(new_data) {
    const url = "/submit-form"; 
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_data)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("Response:", response);
        return response.json();
    })
    .then(data => {
        console.log('Success 2:', data);
    })
    .catch((error) => {
        console.error('Error 2:', error);
    });
}

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
        update(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

const form = document.createElement('form');

const ime = document.createElement('input');
ime.type = 'text';
ime.placeholder = 'First name';

const prezime = document.createElement('input');
prezime.type = 'text';
prezime.placeholder = 'Last name';

const email = document.createElement('input');
email.type = 'email';
email.placeholder = 'Email';

const text = document.createElement('textarea');
text.placeholder = 'Write your message here...';

const button = document.createElement('button');
button.textContent = 'Submit';

form.appendChild(ime);
form.appendChild(prezime);
form.appendChild(email);
form.appendChild(text);
form.appendChild(button);

document.body.appendChild(form);

button.addEventListener('click', () => {
    event.preventDefault();
    if(ime.value === '' || prezime.value === '' || email.value === '' || text.value === '') {
        alert('Please fill in all fields');
        return;
    }
    sendData({
        first_name: ime.value,
        last_name: prezime.value,
        email: email.value,
        text: text.value
    })
});