// Create a form element
const form = document.createElement('form');

const input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json';
form.appendChild(input);
document.body.appendChild(form);