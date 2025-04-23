import { createControlBar } from '/static/js/components/controls.js';
import { createStartButton } from '/static/js/components/buttons.js';

document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const inputSection = document.getElementById('input-section');
    const visualizationArea = document.getElementById('visualization-area');

    // Create a canvas element for the visualization
    const canvas = document.createElement('canvas');
    visualizationArea.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Colors
    const WHITE = '#ffffff';
    const BLACK = '#000000';
    const RED = '#ff0000';
    const GRAY = '#a9a9a9';

    // Global variables
    let paused = true; // Start in paused state
    let callStack = [];
    let exitedNodes = [];
    let nodesToDraw = [];
    let animationSpeed = 500; // Default delay in milliseconds (adjustable)
    let history = []; // Array to store the history of states
    let historyIndex = -1; // Index to track the current position in the history

    // TreeNode class
    class TreeNode {
        constructor(value, x, y, level, scale) {
            this.value = value;
            this.x = x;
            this.y = y;
            this.level = level;
            this.scale = scale; // Scale factor for node size and line length
            this.left = null;
            this.right = null;
            this.exited = false; // Flag to indicate if the node has exited
        }
    }

    // Simulate Fibonacci tree
    function simulateFibonacciTree(n, x, y, dx, scale) {
        const root = new TreeNode(n, x, y, 0, scale);
        callStack.push([root, 'start']); // Start processing the root node
        return root;
    }

    // Save the current state to the history
    function saveState() {
        history = history.slice(0, historyIndex + 1); // Remove future states if stepping back
        history.push({
            callStack: structuredClone(callStack),
            exitedNodes: structuredClone(exitedNodes),
            nodesToDraw: structuredClone(nodesToDraw),
        });
        historyIndex++;
    }

    // Restore the state from the history
    function restoreState() {
        if (historyIndex >= 0) {
            const state = history[historyIndex];
            callStack = structuredClone(state.callStack);
            exitedNodes = structuredClone(state.exitedNodes);
            nodesToDraw = structuredClone(state.nodesToDraw);
        }
    }

    // Draw the tree
    function drawTree(node) {
        if (!node) return;

        // Determine the color of the node
        const color = node.exited ? GRAY : RED;

        // Draw the current node (scaled down based on the scale factor)
        const radius = 20 * node.scale;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        // Draw the node's value
        ctx.fillStyle = BLACK;
        ctx.font = `${16 * node.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value.toString(), node.x, node.y);

        // Draw lines to child nodes (scaled down based on the scale factor)
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.left.x, node.left.y);
            ctx.strokeStyle = BLACK;
            ctx.lineWidth = 2 * node.scale;
            ctx.stroke();
        }
        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.right.x, node.right.y);
            ctx.strokeStyle = BLACK;
            ctx.lineWidth = 2 * node.scale;
            ctx.stroke();
        }
    }

    // Process the next step in the recursion
    function processNextStep() {
        if (!callStack.length) return;

        const [currentNode, action] = callStack.shift();

        if (action === 'start') {
            nodesToDraw.push(currentNode);

            if (currentNode.value > 1) {
                currentNode.left = new TreeNode(
                    currentNode.value - 1,
                    currentNode.x - (canvas.width / (2 ** (currentNode.level + 2)) * currentNode.scale),
                    currentNode.y + 100 * currentNode.scale,
                    currentNode.level + 1,
                    currentNode.scale
                );
                currentNode.right = new TreeNode(
                    currentNode.value - 2,
                    currentNode.x + (canvas.width / (2 ** (currentNode.level + 2)) * currentNode.scale),
                    currentNode.y + 100 * currentNode.scale,
                    currentNode.level + 1,
                    currentNode.scale
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

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all nodes
        for (const node of nodesToDraw) {
            drawTree(node);
        }

        // Continue animation only if not paused
        if (!paused && callStack.length > 0) {
            saveState(); // Save the current state before processing the next step
            processNextStep();

            // Schedule the next frame with a delay based on animationSpeed
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, animationSpeed);
        } else {
            // Keep the animation loop alive even when paused
            requestAnimationFrame(animate);
        }
    }

    // Input Field
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.id = 'n-input';
    inputField.placeholder = 'Enter N (e.g., 6)';
    inputField.value = 6;
    inputField.classList.add('p-2', 'border', 'border-gray-300', 'rounded');
    inputSection.appendChild(inputField);

    // Control Bar Setup
    const controlBar = createControlBar({
        onPlayPause: () => {
            paused = !paused;
        },
        onStepForward: () => {
            if (callStack.length) {
                saveState();
                processNextStep();
            }
        },
        onStepBackward: () => {
            if (historyIndex > 0) {
                historyIndex--;
                restoreState();
            }
        },
        onSpeedChange: (value) => {
            animationSpeed = value;
        },
        defaultSpeed: animationSpeed,
    });

    inputSection.appendChild(controlBar);

    // Start Button
    const startButton = createStartButton(() => {
        const n = parseInt(inputField.value, 10);
        if (isNaN(n) || n < 1) {
            alert('Please enter a valid positive integer.');
            return;
        }

        // Reset state
        callStack = [];
        exitedNodes = [];
        nodesToDraw = [];
        history = [];
        historyIndex = -1;
        paused = false;

        // Dynamically calculate the scale factor based on the input value
        const maxLevels = n; // Maximum levels in the tree
        const scale = Math.min(1, Math.min(canvas.width / (2 ** maxLevels), canvas.height / (maxLevels * 100)));

        // Simulate the Fibonacci tree
        simulateFibonacciTree(n, canvas.width / 2, 50, canvas.width / 4, scale);

        // Save the initial state
        saveState();

        // Start animation
        animate();
    });

    inputSection.appendChild(startButton);

    // Set canvas dimensions dynamically
    function updateCanvasSize() {
        canvas.width = visualizationArea.clientWidth;
        canvas.height = visualizationArea.clientHeight;
    }

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize(); // Initial sizing
});