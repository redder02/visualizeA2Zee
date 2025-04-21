document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');

    // Create input field for array
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'input';
    inputField.placeholder = 'Enter comma-separated numbers (e.g., 5,3,8,4,2,7,1,10,6,9)';
    inputField.value = '5,3,8,4,2,7,1,10,6,9'; // Default value
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
        <h3 class="text-xl font-bold mb-2">Insertion Sort</h3>
        <p><strong>Steps:</strong></p>
        <ol class="list-decimal pl-6">
            <li>Start with the second element of the array.</li>
            <li>Compare it with the elements before it and insert it into the correct position.</li>
            <li>Repeat for each subsequent element, shifting elements as needed.</li>
            <li>Continue until the entire array is sorted.</li>
            <li>Best case: The array is already sorted.</li>
        </ol>
        <p><strong>Time Complexity:</strong> O(n²) in the worst and average cases, O(n) in the best case (already sorted).</p>
        <p><strong>Space Complexity:</strong> O(1).</p>
    `;
    inputSection.appendChild(algorithmDetails);

    // Add event listener for the button
    startButton.addEventListener('click', async () => {
        const input = document.getElementById('input').value.trim().split(',').map(Number);
        if (!input || input.some(isNaN)) {
            alert("Please enter valid comma-separated numbers.");
            return;
        }

        const area = document.getElementById('visualization-area');
        area.innerHTML = '';
        area.style.setProperty('--num-bars', input.length);

        const maxValue = Math.max(...input);

        // Create bars for the array
        const bars = input.map(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.textContent = value; // Display the value on the bar
            area.appendChild(bar);
            return bar;
        });

        // Insertion Sort animation
        for (let i = 1; i < input.length; i++) {
            let key = input[i];
            let j = i - 1;

            // Highlight the key element in red
            bars[i].style.backgroundColor = '#F44336'; // Red for comparison
            await sleep(500); // Pause to highlight the key

            while (j >= 0 && input[j] > key) {
                // Highlight the current bar being compared in red
                bars[j].style.backgroundColor = '#F44336';
                await sleep(500); // Pause to show comparison

                // Shift the bar to the right
                input[j + 1] = input[j];
                updateBars(input, bars, maxValue);

                // Reset the color of the shifted bar to green
                bars[j + 1].style.backgroundColor = '#4CAF50';
                await sleep(500); // Pause after shifting

                j--;
            }

            // Insert the key element into its correct position
            input[j + 1] = key;
            updateBars(input, bars, maxValue);

            // Highlight the inserted element in green
            bars[j + 1].style.backgroundColor = '#4CAF50';
            await sleep(500); // Pause to show insertion
        }

        // Mark all bars as sorted (green)
        bars.forEach(bar => bar.style.backgroundColor = '#4CAF50');
    });

    function updateBars(array, bars, maxValue) {
        array.forEach((value, index) => {
            bars[index].style.height = `${(value / maxValue) * 100}%`;
            bars[index].textContent = value; // Update displayed value
        });
    }

    // Utility function to create a delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});