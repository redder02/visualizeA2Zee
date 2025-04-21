document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');

    // Create input field for array
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'input';
    inputField.placeholder = 'Enter comma-separated numbers (e.g., 15,9,12,3,6,18,21,24,27,30)';
    inputField.value = '15,9,12,3,6,18,21,24,27,30'; // Default value
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
    algorithmDetails.classList.add('algorithm-details', 'mb-4'); // Add margin bottom for spacing
    algorithmDetails.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Selection Sort</h3>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Start with the first element of the array.</li>
            <li>Find the smallest element in the unsorted portion of the array.</li>
            <li>Swap it with the first element of the unsorted portion.</li>
            <li>Move to the next position and repeat the process for the remaining unsorted portion.</li>
            <li>Continue until the entire array is sorted.</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(n²) in all cases (best, average, and worst).</p>
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
            bar.textContent = value; // Display the value inside the bar
            area.appendChild(bar);
            return bar;
        });

        // Selection Sort animation
        let i = 0;
        const sortInterval = setInterval(() => {
            if (i >= input.length - 1) {
                clearInterval(sortInterval);
                bars.forEach(bar => bar.classList.add('sorted')); // Mark all bars as sorted
                return;
            }

            let minIndex = i;

            // Highlight the current position (no need for a separate color)
            for (let j = i + 1; j < input.length; j++) {
                // Highlight bars being compared in red
                bars[j].classList.add('comparing');

                setTimeout(() => {
                    if (input[j] < input[minIndex]) {
                        minIndex = j;
                    }

                    // Reset comparison highlight after the delay
                    bars[j].classList.remove('comparing');
                }, 500); // Comparison delay
            }

            setTimeout(() => {
                if (minIndex !== i) {
                    [input[i], input[minIndex]] = [input[minIndex], input[i]];
                    updateBars(input, bars, maxValue);
                }

                i++;
            }, 1000); // Swap delay
        }, 1500); // Outer loop delay
    });

    function updateBars(array, bars, maxValue) {
        array.forEach((value, index) => {
            bars[index].style.height = `${(value / maxValue) * 100}%`;
            bars[index].textContent = value; // Update displayed value
        });
    }
});