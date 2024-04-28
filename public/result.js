function fetchFile() {
    fetch('topics.json')
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const topics = data;
        topics.sort((a, b) => b.count_positive - a.count_positive);
        console.log("Success:", topics);

        // Iterate over positive topics
        let max1 = 0;
        const max = 5;
        const a1 = [];
        for (topic of topics) {
            for (let i = 0; i < topic.count_positive && max1 < max && i < 2; i++) {
                a1.push(topic.positive_list[i]);
                max1++;
            }
        }
        const a2 = [];
        let max2 = 0;
        topics.sort((a, b) => b.count_negative - a.count_negative);
        for (topic of topics) {
            for (let i = 0; i < topic.count_negative && max2 < max && i < 2; i++) {
                a2.push(topic.negative_list[i]);
                max2++;
            }
        }
        // Create a table element
        const table = document.createElement('table');
        table.className = 'table';

        // Add a heading row for positive and negative topics
        const headingRow = document.createElement('tr');

        // Add heading for positive topics
        const headingPositive = document.createElement('th');
        headingPositive.textContent = 'Most common positive topics';

        // Add heading for negative topics
        const headingNegative = document.createElement('th');
        headingNegative.textContent = 'Most common negative topics';

        // Append headings to the heading row
        headingRow.appendChild(headingPositive);
        headingRow.appendChild(headingNegative);

        // Append the heading row to the table
        table.appendChild(headingRow);
        let i1 = 0, i2 = 0;
        while(i1 < max1 || i2 < max2) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            
            const cell2 = document.createElement('td');
            if(i1 < max1) {
                cell1.textContent = a1[i1];
                cell1.className = 'tableElement';
                i1++;
            }
            if(i2 < max2) {
                cell2.textContent = a2[i2];
                cell2.className = 'tableElement';  
                i2++;
            }
            row.appendChild(cell1);
            row.appendChild(cell2);
            table.appendChild(row);
        }
        document.body.appendChild(table);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

fetchFile();
const endLine = document.createElement('p');
endLine.textContent = '\n';
const button = document.createElement('button');
button.textContent = 'Update results';
document.body.appendChild(button);
document.body.appendChild(endLine);

button.addEventListener('click', () => {
    location.reload();
});
