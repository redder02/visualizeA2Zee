document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS into the document
    const style = document.createElement('style');
    style.innerHTML = `
        #visualization-area {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .bar {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            transition: background-color 0.3s ease;
        }

        .bar.highlight {
            background-color: red; /* Highlight mid element in red */
        }

        .bar.low-pointer {
            border-bottom: 4px solid blue; /* Indicate low pointer */
        }

        .bar.high-pointer {
            border-bottom: 4px solid green; /* Indicate high pointer */
        }

        .bar.found {
            background-color: green; /* Mark the found node in green */
        }

        .result-message {
            margin-top: 10px;
            font-size: 16px;
            font-weight: bold;
        }

        .success {
            color: green;
        }

        .failure {
            color: red;
        }
    `;
    document.head.appendChild(style);

    const inputSection = document.getElementById('input-section');

    // Create input field for array
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'input';
    inputField.placeholder = 'Enter sorted rotated array (e.g., 4,5,6,7,0,1,2)';
    inputField.value = '4,5,6,7,0,1,2'; // Default value
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
    targetField.placeholder = 'Enter target value (e.g., 0)';
    targetField.value = '0'; // Default value
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

    // Algorithm Details
    const algorithmDetails = document.createElement('div');
    algorithmDetails.classList.add('algorithm-details', 'mb-4'); // Add margin bottom for spacing
    algorithmDetails.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Search in Sorted Rotated Array</h3>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Identify the sorted half of the array (left or right).</li>
            <li>Determine if the target lies within the sorted half.</li>
            <li>Narrow down the search space accordingly.</li>
            <li>Repeat until the target is found or the subarray size becomes zero.</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(log n) in all cases.</p>
        <p><strong>Space Complexity:</strong> O(1).</p>
    `;
    inputSection.appendChild(algorithmDetails);

    // Result Message Container
    const resultMessageContainer = document.createElement('div');
    resultMessageContainer.id = 'result-message-container';
    inputSection.appendChild(resultMessageContainer);

    // Add event listener for the button
    startButton.addEventListener('click', () => {
        const input = document.getElementById('input').value.trim().split(',').map(Number);
        const target = parseInt(document.getElementById('target').value.trim(), 10);

        if (!input || input.some(isNaN) || isNaN(target)) {
            resultMessageContainer.innerHTML = '<p class="result-message failure">Please enter valid input and target values.</p>';
            return;
        }

        resultMessageContainer.innerHTML = ''; // Clear previous messages

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

        // Search in sorted rotated array logic
        let low = 0, high = input.length - 1;
        let ans = -1; // Variable to store the index of the target
        const searchInterval = setInterval(() => {
            if (low > high) {

                clearInterval(searchInterval);
                if (ans !== -1) {
                    // Mark the found node with green color
                    boxes[ans].classList.add('found');
                    resultMessageContainer.innerHTML = `<p class="result-message success">Target found at index ${ans}.</p>`;
                } else {
                    resultMessageContainer.innerHTML = '<p class="result-message failure">Target not found!</p>';
                }
                return;
            }

            const mid = Math.floor((low + high) / 2);

            // Remove previous highlights
            boxes.forEach((box, index) => {
                box.classList.remove('highlight', 'low-pointer', 'high-pointer');
            });

            // Highlight the mid-point in red
            boxes[mid].classList.add('highlight');

            // Highlight low and high pointers
            boxes[low].classList.add('low-pointer');
            boxes[high].classList.add('high-pointer');

            setTimeout(() => {
                if (input[mid] === target) {
                    ans = mid; // Target found
                    clearInterval(searchInterval); // Stop further iterations
                } else if (input[low] <= input[mid]) {
                    // Left half is sorted
                    if (target >= input[low] && target < input[mid]) {
                        high = mid - 1; // Target lies in the left half
                    } else {
                        low = mid + 1; // Target lies in the right half
                    }
                } else {
                    // Right half is sorted
                    if (target > input[mid] && target <= input[high]) {
                        low = mid + 1; // Target lies in the right half
                    } else {
                        high = mid - 1; // Target lies in the left half
                    }
                }
            }, 1000);
        }, 1500);
    });
});