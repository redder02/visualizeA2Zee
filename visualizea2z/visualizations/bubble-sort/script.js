document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    // Create input field for array
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'input';
    inputField.placeholder = 'Enter comma-separated numbers (e.g., 10,9,8,7,6,5,4,3,2,1)';
    inputField.value = '10,9,8,7,6,5,4,3,2,1'; // Default value
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
    algorithmDetails.classList.add('algorithm-details', 'mb-4');
    algorithmDetails.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Bubble Sort</h3>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Start at the beginning of the array.</li>
            <li>Compare adjacent elements and swap them if they are in the wrong order.</li>
            <li>Move to the next pair of elements and repeat.</li>
            <li>After one pass, the largest element will "bubble" to the end.</li>
            <li>Repeat the process for the remaining unsorted portion of the array.</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(n²) in the worst and average cases, O(n) in the best case (already sorted).</p>
        <p><strong>Space Complexity:</strong> O(1).</p>
    `;
    inputSection.appendChild(algorithmDetails);
    // Add event listener for the button
    startButton.addEventListener('click', () => {
        const input = document.getElementById('input').value.trim().split(',').map(Number);
        if (!input || input.some(isNaN)) {
            alert("Please enter valid comma-separated numbers.");
            return;
        }

        const area = document.getElementById('visualization-area');
        area.innerHTML = '';
        area.style.setProperty('--num-bars', input.length); // Set dynamic width for bars

        const maxValue = Math.max(...input);

        // Create bars for the array
        const bars = input.map(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${(value / maxValue) * 100}%`; // Normalize height
            area.appendChild(bar);
            return bar;
        });

        // Bubble Sort animation
        let i = 0, j = 0;
        const sortInterval = setInterval(() => {
            if (i >= input.length) {
                clearInterval(sortInterval);
                return;
            }
            if (j >= input.length - i - 1) {
                i++;
                j = 0;
                return;
            }

            // Highlight bars being compared
            bars[j].classList.add('highlight');
            bars[j + 1].classList.add('highlight');

            setTimeout(() => {
                if (input[j] > input[j + 1]) {
                    [input[j], input[j + 1]] = [input[j + 1], input[j]];
                    updateBars(input, bars, maxValue);
                }

                // Reset bar colors
                bars[j].classList.remove('highlight');
                bars[j + 1].classList.remove('highlight');
                j++;
            }, 500);
        }, 1000);
    });

    function updateBars(array, bars, maxValue) {
        array.forEach((value, index) => {
            bars[index].style.height = `${(value / maxValue) * 100}%`;
        });
    }
});