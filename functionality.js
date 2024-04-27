// Create a form element
const form = document.createElement('form');

const input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json';

const files = [];

const button = document.createElement('button');
button.style.padding = '8px 16px';
button.style.margin = '8px';

form.appendChild(input);
form.appendChild(button);
document.body.appendChild(form);

input.addEventListener('change', () => {
    files.push(input.files[0]);
});

button.addEventListener('click', () => {
    event.preventDefault();
    
});