document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS into the document
    const style = document.createElement('style');
    style.innerHTML = `
        #visualization-area {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 80vh;
            overflow: auto;
        }

        .grid-container {
            display: grid;
            grid-template-columns: repeat(9, 50px);
            grid-template-rows: repeat(9, 50px);
            gap: 2px;
            border: 2px solid black;
        }

        .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
//            border: 1px solid #ccc;
            background-color: #f9f9f9;
            font-size: 24px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .cell.current {
            background-color: red; /* Active cell being processed */
        }

        .cell.reset {
            background-color: blue; /* Cell reset during backtracking */
        }

        .cell.highlight {
            background-color: yellow; /* Highlighting row/column/subgrid checks */
        }

        .cell.subgrid-border {
            border: 30px solid black; /* Thicker border for subgrid edges */
        }

        .status-message {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
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

    // Create Start Visualization button
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

    // Input fields for row, column, and value
    const rowInput = document.createElement('input');
    rowInput.type = 'number';
    rowInput.placeholder = 'Row (1-9)';
    rowInput.classList.add('mr-2');

    const colInput = document.createElement('input');
    colInput.type = 'number';
    colInput.placeholder = 'Column (1-9)';
    colInput.classList.add('mr-2');

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.placeholder = 'Value (1-9)';
    valueInput.classList.add('mr-2');

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Cell';
    updateButton.classList.add(
        'px-4',
        'py-2',
        'bg-green-500',
        'text-white',
        'rounded-md',
        'hover:bg-green-600',
        'transition',
        'duration-300'
    );

    inputSection.appendChild(rowInput);
    inputSection.appendChild(colInput);
    inputSection.appendChild(valueInput);
    inputSection.appendChild(updateButton);

    // Status Message Container
    const statusMessageContainer = document.createElement('div');
    statusMessageContainer.id = 'status-message-container';
    statusMessageContainer.classList.add('status-message');
    inputSection.appendChild(statusMessageContainer);

    // Event listener for updating the grid
    updateButton.addEventListener('click', () => {
        const row = parseInt(rowInput.value) - 1;
        const col = parseInt(colInput.value) - 1;
        const value = parseInt(valueInput.value);

        // Validate inputs
        if (row < 0 || row > 8 || col < 0 || col > 8) {
            alert('Row and Column must be between 1 and 9.');
            return;
        }
        if (value < 0 || value > 9) {
            alert('Value must be between 1 and 9 or empty.');
            return;
        }

        // Update the grid
        grid[row][col] = value || 0;
        updateUI();
    });

    // Add event listener for the Start Visualization button
    startButton.addEventListener('click', () => {
        // Initialize the Sudoku grid
        const grid = [
            [5, 3, 4, 0, 7, 0, 0, 0, 0],  // Row 1 (2 empty cells)
            [6, 0, 2, 1, 9, 5, 0, 0, 0],  // Row 2 (2 empty cells)
            [0, 9, 8, 3, 4, 0, 0, 6, 0],  // Row 3 (2 empty cells)
            [8, 5, 9, 7, 6, 1, 4, 2, 3],  // Row 4 (No empty cells)
            [4, 2, 6, 8, 5, 3, 7, 9, 1],  // Row 5 (No empty cells)
            [7, 1, 3, 9, 2, 4, 8, 5, 6],  // Row 6 (No empty cells)
            [9, 6, 1, 5, 3, 7, 2, 8, 4],  // Row 7 (No empty cells)
            [2, 8, 7, 4, 1, 9, 6, 3, 5],  // Row 8 (No empty cells)
            [3, 4, 5, 2, 8, 6, 1, 7, 9]   // Row 9 (No empty cells)
        ];

        const area = document.getElementById('visualization-area');
        area.innerHTML = '';

        // Create the grid container
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        area.appendChild(gridContainer);

        // Create cells for the grid
        const cells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (grid[row][col] !== 0) {
                    cell.textContent = grid[row][col];
                }

                // Add thicker borders for subgrid edges
                if (row % 3 === 0 || row % 3 === 2) {
                    cell.style.borderTopWidth = '5px';
                    cell.style.borderBottomWidth = '5px';
                }
                if (col % 3 === 0 || col % 3 === 2) {
                    cell.style.borderLeftWidth = '5px';
                    cell.style.borderRightWidth = '5px';
                }

                gridContainer.appendChild(cell);
                cells.push({ row, col, element: cell });
            }
        }

        let currentRow = 0, currentCol = 0;
        let solving = true;
        let paused = false;
        let statusMessage = '';

        const isValid = (row, col, num) => {
            // Check row
            for (let c = 0; c < 9; c++) {
                if (grid[row][c] === num) return false;
            }

            // Check column
            for (let r = 0; r < 9; r++) {
                if (grid[r][col] === num) return false;
            }

            // Check 3x3 subgrid
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let r = startRow; r < startRow + 3; r++) {
                for (let c = startCol; c < startCol + 3; c++) {
                    if (grid[r][c] === num) return false;
                }
            }

            return true;
        };

        const highlightChecks = (row, col) => {
            cells.forEach(({ row: r, col: c, element }) => {
                element.classList.remove('highlight');
                if (r === row || c === col ||
                    (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3))) {
                    element.classList.add('highlight');
                }
            });
        };

        const solveSudoku = async () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        currentRow = row;
                        currentCol = col;

                        for (let num = 1; num <= 9; num++) {
                            statusMessage = `Trying ${num} at (${row + 1}, ${col + 1})`;
                            updateUI();

                            await new Promise(resolve => setTimeout(resolve, 200)); // Faster delay

                            if (isValid(row, col, num)) {
                                grid[row][col] = num;
                                statusMessage = `Placed ${num} at (${row + 1}, ${col + 1})`;
                                updateUI();

                                await new Promise(resolve => setTimeout(resolve, 200)); // Faster delay

                                await solveSudoku();

                                if (isSolved()) {
                                    statusMessage = "Found!";
                                    updateUI();
                                    return; // Stop further execution
                                }

                                grid[row][col] = 0;
                                statusMessage = `Backtracking: Reset (${row + 1}, ${col + 1})`;
                                updateUI();

                                await new Promise(resolve => setTimeout(resolve, 200)); // Faster delay
                            }
                        }

                        return;
                    }
                }
            }

            statusMessage = "Sudoku Solved!";
            updateUI();
        };

        const isSolved = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) return false;
                }
            }
            return true;
        };

        const updateUI = () => {
            cells.forEach(({ row, col, element }) => {
                element.textContent = grid[row][col] !== 0 ? grid[row][col] : '';
                element.classList.toggle('current', row === currentRow && col === currentCol);
                element.classList.toggle('reset', grid[row][col] === 0 && row === currentRow && col === currentCol);
            });

            statusMessageContainer.textContent = statusMessage;
        };

        // Start the visualization
        solveSudoku();
    });
});