document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const inputSection = document.getElementById('input-section');
    const visualizationArea = document.getElementById('visualization-area');

    // Create a canvas element for the visualization
    const canvas = document.createElement('canvas');
    canvas.width = visualizationArea.clientWidth;
    canvas.height = visualizationArea.clientHeight;
    visualizationArea.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Colors
    const WHITE = '#ffffff';
    const BLACK = '#000000';
    const RED = '#ff0000';
    const GRAY = '#a9a9a9';

    // Global variables
    let paused = false;
    let callStack = [];
    let exitedNodes = [];
    let nodesToDraw = [];
    let animationSpeed = 500; // Default delay in milliseconds (adjustable)

    // TreeNode class
    class TreeNode {
        constructor(value, x, y, level) {
            this.value = value;
            this.x = x;
            this.y = y;
            this.level = level;
            this.left = null;
            this.right = null;
            this.exited = false; // Flag to indicate if the node has exited
        }
    }

    // Simulate Fibonacci tree
    function simulateFibonacciTree(n, x, y, dx) {
        const root = new TreeNode(n, x, y, 0);
        callStack.push([root, 'start']); // Start processing the root node
        return root;
    }

    // Draw the tree
    function drawTree(node) {
        if (!node) return;

        // Determine the color of the node
        const color = node.exited ? GRAY : RED;

        // Draw the current node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // Draw the node's value
        ctx.fillStyle = BLACK;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value.toString(), node.x, node.y);

        // Draw lines to child nodes
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.left.x, node.left.y);
            ctx.strokeStyle = BLACK;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.right.x, node.right.y);
            ctx.strokeStyle = BLACK;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Process the next step in the recursion with delay
    function processNextStep() {
        if (!callStack.length) return;

        const [currentNode, action] = callStack.shift();

        if (action === 'start') {
            nodesToDraw.push(currentNode);

            if (currentNode.value > 1) {
                currentNode.left = new TreeNode(
                    currentNode.value - 1,
                    currentNode.x - (canvas.width / (2 ** (currentNode.level + 2))),
                    currentNode.y + 100,
                    currentNode.level + 1
                );
                currentNode.right = new TreeNode(
                    currentNode.value - 2,
                    currentNode.x + (canvas.width / (2 ** (currentNode.level + 2))),
                    currentNode.y + 100,
                    currentNode.level + 1
                );

                callStack.unshift([currentNode, 'end']);
                callStack.unshift([currentNode.right, 'start']);
                callStack.unshift([currentNode.left, 'start']);
            } else {
                currentNode.exited = true;
                exitedNodes.push(currentNode);
            }
        } else if (action === 'end') {
            currentNode.exited = true;
            exitedNodes.push(currentNode);
        }
    }

    // Animation loop with delay
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all nodes
        for (const node of nodesToDraw) {
            drawTree(node);
        }

        if (!paused && callStack.length) {
            setTimeout(() => {
                processNextStep();
                requestAnimationFrame(animate);
            }, animationSpeed); // Use the adjustable animation speed here
        } else {
            requestAnimationFrame(animate);
        }
    }

    // Dynamically create input and button elements
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.id = 'n-input';
    inputField.placeholder = 'Enter N (e.g., 6)';
    inputField.classList.add('p-2', 'border', 'border-gray-300', 'rounded');
    inputSection.appendChild(inputField);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Animation';
    startButton.classList.add('p-2', 'bg-blue-500', 'text-white', 'rounded', 'hover:bg-blue-600');
    inputSection.appendChild(startButton);

    // Add a slider for animation speed control
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '100'; // Minimum delay (in ms)
    speedSlider.max = '2000'; // Maximum delay (in ms)
    speedSlider.value = animationSpeed; // Default value
    speedSlider.classList.add('w-full', 'mt-2');
    inputSection.appendChild(speedSlider);

    const speedLabel = document.createElement('div');
    speedLabel.textContent = `Animation Speed: ${animationSpeed}ms`;
    speedLabel.classList.add('text-sm', 'text-gray-600', 'mt-1');
    inputSection.appendChild(speedLabel);

    // Update animation speed dynamically
    speedSlider.addEventListener('input', () => {
        animationSpeed = parseInt(speedSlider.value, 10);
        speedLabel.textContent = `Animation Speed: ${animationSpeed}ms`;
    });

    // Event listener for the start button
    startButton.addEventListener('click', () => {
        const n = parseInt(inputField.value, 10);

        if (isNaN(n) || n < 1) {
            alert('Please enter a valid positive integer.');
            return;
        }

        // Reset state
        callStack = [];
        exitedNodes = [];
        nodesToDraw = [];
        paused = false;

        // Simulate the Fibonacci tree
        simulateFibonacciTree(n, canvas.width / 2, 50, canvas.width / 4);

        // Start animation
        animate();
    });

    // Pause functionality
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            paused = !paused;
        }
    });
});