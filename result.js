function fetchFile() {
    fetch('topics.json')
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const container = document.createElement('div');
        container.textContent = JSON.stringify(data);
        document.body.appendChild(container);
        console.log("Success:", data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
fetchFile();

const button = document.createElement('button');
button.textContent = 'Update results';
document.body.appendChild(button);

button.addEventListener('click', () => {
    location.reload();
});
