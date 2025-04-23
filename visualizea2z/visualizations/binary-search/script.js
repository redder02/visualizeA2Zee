document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS into the document
    const style = document.createElement('style');
    style.innerHTML = `
        /* General Styles */
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

        /* Compact Control Bar */
        #control-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            background-color: #2d3748; /* Dark background for control bar */
            padding: 10px;
            border-radius: 8px;
        }

        #control-bar button {
            background-color: transparent; /* Transparent background */
            border: none;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }

        #control-bar button:hover {
            background-color: rgba(255, 255, 255, 0.1); /* Hover effect */
        }

        #control-bar svg {
            width: 18px;
            height: 18px;
            fill: white; /* White icons for better visibility */
        }

        #speed-slider {
            flex-grow: 1; /* Allow the slider to take up remaining space */
            margin-left: 10px;
        }

        /* Start Visualization Button */
        #start-visualization {
            width: 100%; /* Full width on small screens */
            margin-top: 10px;
        }

        @media (min-width: 768px) {
            #start-visualization {
                width: auto; /* Auto width on larger screens */
            }
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
        'ml-2',
        'border',
        'border-gray-300',
        'rounded-md',
        'focus:outline-none',
        'focus:border-blue-500'
    );
    inputSection.appendChild(targetField);

    // Compact Control Bar
    const controlBar = document.createElement('div');
    controlBar.id = 'control-bar';
    inputSection.appendChild(controlBar);

    // Step Backward Button
    const stepBackwardButton = document.createElement('button');
    stepBackwardButton.id = 'step-backward';
    stepBackwardButton.classList.add('p-2', 'text-white', 'hover:bg-gray-700', 'rounded-full');
    stepBackwardButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
    `;
    controlBar.appendChild(stepBackwardButton);

    // Play/Pause Button
    const playPauseButton = document.createElement('button');
    playPauseButton.id = 'play-pause';
    playPauseButton.classList.add('p-2', 'text-white', 'hover:bg-gray-700', 'rounded-full');
    playPauseButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
            <!-- Circle Background -->
            <circle cx="12" cy="12" r="10" fill="white" />
            <!-- Play Icon -->
            <path id="play-icon" fill="black" d="M10 8v8l6-4z" />
            <!-- Pause Icon -->
            <path id="pause-icon" fill="black" d="M10 8h2v8h-2zm4 0h2v8h-2z" style="display: none;" />
        </svg>
    `;
    controlBar.appendChild(playPauseButton);

    // Step Forward Button
    const stepForwardButton = document.createElement('button');
    stepForwardButton.id = 'step-forward';
    stepForwardButton.classList.add('p-2', 'text-white', 'hover:bg-gray-700', 'rounded-full');
    stepForwardButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
    `;
    controlBar.appendChild(stepForwardButton);

    // Speed Slider
    const speedSliderContainer = document.createElement('div');
    speedSliderContainer.classList.add('flex-grow', 'mx-4');
    controlBar.appendChild(speedSliderContainer);
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.id = 'speed-slider';
    speedSlider.classList.add('w-full');
    speedSlider.min = '100'; // Minimum delay (in ms)
    speedSlider.max = '4000'; // Maximum delay (in ms)
    speedSlider.value = '1500'; // Default value
    speedSliderContainer.appendChild(speedSlider);

    // Add Start Visualization button
    const startButton = document.createElement('button');
    startButton.id = 'start-visualization';
    startButton.textContent = 'Start Animation';
    startButton.classList.add(
        'p-2',
        'bg-blue-500',
        'text-white',
        'rounded',
        'hover:bg-blue-600',
        'ml-2'
    );
    inputSection.appendChild(startButton);

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

    // Result Message Container
    const resultMessageContainer = document.createElement('div');
    resultMessageContainer.id = 'result-message-container';
    inputSection.appendChild(resultMessageContainer);

    let paused = true;
    let animationSpeed = parseInt(speedSlider.value, 10);
    let low, high, mid, input, target, boxes, history = [], historyIndex = -1;
    let animationInterval;

    // Function to initialize binary search
    function initializeBinarySearch() {
        input = document.getElementById('input').value.trim().split(',').map(Number);
        target = parseInt(document.getElementById('target').value.trim(), 10);

        if (!input || input.some(isNaN) || isNaN(target)) {
            resultMessageContainer.innerHTML = '<p class="result-message failure">Please enter valid input and target values.</p>';
            return;
        }

        resultMessageContainer.innerHTML = ''; // Clear previous messages

        const area = document.getElementById('visualization-area');
        area.innerHTML = '';
        area.style.setProperty('--num-bars', input.length);

        // Create boxes for the array
        boxes = input.map(value => {
            const box = document.createElement('div');
            box.textContent = value;
            box.classList.add('bar');
            box.style.width = 'calc(100% / var(--num-bars))';
            area.appendChild(box);
            return box;
        });

        // Initialize binary search variables
        low = 0;
        high = input.length - 1;
        history = [];
        historyIndex = -1;

        saveState();
        updateVisualization();
    }

    // Save the current state to history
    function saveState() {
        history = history.slice(0, historyIndex + 1); // Remove future states
        history.push({ low, high, mid });
        historyIndex++;
    }

    // Update visualization based on current state
    function updateVisualization() {
        // Remove previous highlights
        boxes.forEach((box, index) => {
            box.classList.remove('highlight', 'low-pointer', 'high-pointer');
        });

        if (low <= high) {
            // Highlight low, high, and mid pointers
            boxes[low].classList.add('low-pointer');
            boxes[high].classList.add('high-pointer');
            if (mid !== undefined) boxes[mid].classList.add('highlight');
        }
    }

    // Perform one step of binary search
    function processNextStep() {
        if (low > high) {
            clearInterval(animationInterval); // Stop the animation if the search is complete
            return;
        }

        mid = Math.floor((low + high) / 2);

        saveState();
        updateVisualization();

        if (input[mid] === target) {
            resultMessageContainer.innerHTML = `<p class="result-message success">Target found at index ${mid}.</p>`;
            clearInterval(animationInterval); // Stop the animation when the target is found
        } else if (input[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    // Event listener for Start Visualization button
    startButton.addEventListener('click', () => {
        initializeBinarySearch();
        paused = false;

        // Start automatic animation
        clearInterval(animationInterval); // Clear any existing interval
        animationInterval = setInterval(() => {
            if (!paused) {
                processNextStep();
            }
        }, animationSpeed);

        // Ensure Play/Pause button reflects the correct state
        playPauseButton.querySelector('#play-icon').style.display = 'none';
        playPauseButton.querySelector('#pause-icon').style.display = 'block';
    });

    // Play/Pause functionality
    playPauseButton.addEventListener('click', () => {
        paused = !paused;
        const playIcon = playPauseButton.querySelector('#play-icon');
        const pauseIcon = playPauseButton.querySelector('#pause-icon');
        playIcon.style.display = paused ? 'block' : 'none';
        pauseIcon.style.display = paused ? 'none' : 'block';
    });

    // Step Forward functionality
    stepForwardButton.addEventListener('click', () => {
        if (paused && low <= high) {
            processNextStep();
        }
    });

    // Step Backward functionality
    stepBackwardButton.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            const prevState = history[historyIndex];
            low = prevState.low;
            high = prevState.high;
            mid = prevState.mid;
            updateVisualization();
        }
    });

    // Update animation speed dynamically
    speedSlider.addEventListener('input', () => {
        animationSpeed = parseInt(speedSlider.value, 10);
        clearInterval(animationInterval); // Restart the interval with the new speed
        if (!paused) {
            animationInterval = setInterval(() => {
                if (!paused) {
                    processNextStep();
                }
            }, animationSpeed);
        }
    });
});