document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');

    // Algorithm Details
    const algorithmDetails = document.createElement('div');
    algorithmDetails.classList.add('algorithm-details', 'mb-4'); // Add margin bottom for spacing
    algorithmDetails.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Binary Search</h3>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Start with a sorted array.</li>
            <li>Find the middle element of the array.</li>
            <li>If the target matches the middle element, return its index.</li>
            <li>If the target is smaller, repeat the search on the left half; if larger, repeat on the right half.</li>
            <li>Repeat until the target is found or the subarray size becomes zero.</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(log n) in all cases.</p>
        <p><strong>Space Complexity:</strong> O(1).</p>
    `;
    inputSection.appendChild(algorithmDetails);
    // Create input field for array
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'input';
    inputField.placeholder = 'Enter sorted array (e.g., 2,4,6,8,10,12,14,16,18,20)';
    inputField.value = '2,4,6,8,10,12,14,16,18,20'; // Default value
    inputField.classList.add(
        'flex-grow',
        'px-4',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'focus:outline-none',
        'focus:border-blue-500'
    );
    inputSection.appendChild(inputField);

    // Create input field for target
    const targetField = document.createElement('input');
    targetField.type = 'text';
    targetField.id = 'target';
    targetField.placeholder = 'Enter target value (e.g., 12)';
    targetField.value = '12'; // Default value
    targetField.classList.add(
        'px-4',
        'py-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'focus:outline-none',
        'focus:border-blue-500'
    );
    inputSection.appendChild(targetField);

    // Add Start Visualization button
    const startButton = document.createElement('button');
    startButton.id = 'start-visualization';
    startButton.textContent = 'Start Visualization';
    startButton.classList.add(
        'px-6',
        'py-2',
        'bg-blue-500',
        'text-white',
        'rounded-md',
        'hover:bg-blue-600',
        'transition',
        'duration-300'
    );
    inputSection.appendChild(startButton);
    // Add event listener for the button
    startButton.addEventListener('click', () => {
        const input = document.getElementById('input').value.trim().split(',').map(Number);
        const target = parseInt(document.getElementById('target').value.trim(), 10);

        if (!input || input.some(isNaN) || isNaN(target)) {
            alert("Please enter valid input and target values.");
            return;
        }

        const area = document.getElementById('visualization-area');
        area.innerHTML = '';
        area.style.setProperty('--num-bars', input.length);

        // Create boxes for the array
        const boxes = input.map(value => {
            const box = document.createElement('div');
            box.textContent = value;
            box.classList.add('bar');
            box.style.width = 'calc(100% / var(--num-bars))';
            area.appendChild(box);
            return box;
        });

        // Binary Search logic
        let low = 0, high = input.length - 1;
        const searchInterval = setInterval(() => {
            if (low > high) {
                clearInterval(searchInterval);
                alert("Target not found!");
                return;
            }

            const mid = Math.floor((low + high) / 2);

            // Highlight the mid-point
            boxes[mid].style.backgroundColor = 'red';

            setTimeout(() => {
                if (input[mid] === target) {
                    boxes[mid].style.backgroundColor = 'green';
                    clearInterval(searchInterval);
                    alert("Target found at index " + mid);
                } else if (input[mid] < target) {
                    low = mid + 1;
                    for (let i = low; i <= high; i++) {
                        boxes[i].style.backgroundColor = '#4CAF50';
                    }
                } else {
                    high = mid - 1;
                    for (let i = low; i <= high; i++) {
                        boxes[i].style.backgroundColor = '#4CAF50';
                    }
                }
            }, 1000);
        }, 1500);
    });
});