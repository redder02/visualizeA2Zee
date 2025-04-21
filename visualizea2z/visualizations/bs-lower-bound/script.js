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

        .bar.lower-bound {
            border: 2px solid orange; /* Highlight lower bound */
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

    // Add Lower Bound Visualization button
    const lowerBoundButton = document.createElement('button');
    lowerBoundButton.id = 'lower-bound-visualization';
    lowerBoundButton.textContent = 'Lower Bound';
    lowerBoundButton.classList.add(
        'px-6',
        'py-2',
        'bg-orange-500',
        'text-white',
        'rounded-md',
        'hover:bg-orange-600',
        'transition',
        'duration-300'
    );
    inputSection.appendChild(lowerBoundButton);

    // Algorithm Details
    const algorithmDetails = document.createElement('div');
    algorithmDetails.classList.add('algorithm-details', 'mb-4'); // Add margin bottom for spacing
    algorithmDetails.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Lower Bound</h3>
        <p><strong>Definition:</strong> The first index where the target could be inserted without violating the sorted order (≥ target).</p>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Start with a sorted array.</li>
            <li>Find the middle element of the array.</li>
            <li>If the middle element ≥ target, move to the left half and update the result.</li>
            <li>If the middle element < target, move to the right half.</li>
            <li>Repeat until the subarray size becomes zero.</li>
        </ol>
    `;
    inputSection.appendChild(algorithmDetails);

    // Result Message Container
    const resultMessageContainer = document.createElement('div');
    resultMessageContainer.id = 'result-message-container';
    inputSection.appendChild(resultMessageContainer);

    // Event listener for Lower Bound Visualization button
    lowerBoundButton.addEventListener('click', () => {
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

        let low = 0, high = input.length - 1;
        let result = input.length; // Default result for lower bound
        const searchInterval = setInterval(() => {
            if (low > high) {
                clearInterval(searchInterval);
                boxes.forEach((box, index) => {
                    if (index === result) {
                        box.classList.add('lower-bound'); // Highlight the lower bound
                    }
                });
                resultMessageContainer.innerHTML = `<p class="result-message success">Lower Bound Index: ${result}.</p>`;
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
                if (input[mid] >= target) {
                    result = mid; // Update result for lower bound
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }, 1000);
        }, 1500);
    });
});