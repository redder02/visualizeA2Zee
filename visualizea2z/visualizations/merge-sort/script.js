const style = document.createElement('style');
style.textContent = `
#visualization-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}
.merge-level {
    min-height: 60px;
}
.merge-group {
    transition: all 0.3s ease-in-out;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    const vizArea = document.getElementById('visualization-area');

    // Input box with default values
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter comma-separated numbers';
    input.value = '8, 4, 7, 6, 5, 3, 2, 1'; // Default values
    input.className = 'flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600';

    // Button
    const button = document.createElement('button');
    button.textContent = 'Start Merge Sort';
    button.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600';

    inputSection.appendChild(input);
    inputSection.appendChild(button);

    // Style for local tree layout
    const style = document.createElement('style');
    style.textContent = `
        .tree-level {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .array-block {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;
            background-color: #3b82f6;
            color: white;
            border-radius: 0.5rem;
            font-weight: bold;
            transition: all 0.3s ease-in-out;
        }
        .array-item {
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #2563eb;
            border-radius: 0.375rem;
            transition: all 0.3s ease-in-out;
        }
        .array-item.comparing {
            background-color: #ef4444; /* Red for comparing */
        }
        .array-item.merged {
            background-color: #10b981; /* Green for merged */
        }
    `;
    document.head.appendChild(style);

    button.addEventListener('click', () => {
        const raw = input.value.trim();
        const values = raw.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

        if (!values.length) return alert('Please enter valid numbers.');

        vizArea.innerHTML = '';
        buildMergeTree(values, vizArea);
    });

    async function buildMergeTree(arr, container) {
        const levels = [];
        await mergeSortTree(arr, 0, levels);

        // Display the full tree (splitting phase)
        for (let i = 0; i < levels.length; i++) {
            const row = document.createElement('div');
            row.className = 'tree-level';

            // Create blocks for each part in the level
            for (const part of levels[i]) {
                const block = document.createElement('div');
                block.className = 'array-block';
                for (const val of part) {
                    const item = document.createElement('div');
                    item.className = 'array-item';
                    item.textContent = val;
                    block.appendChild(item);
                }
                row.appendChild(block);
            }

            container.appendChild(row);
            await sleep(500); // Reduced delay for smoother animation
        }

        // Animate the merging process after the tree is fully built
        await animateMerge(levels, container);
    }

    async function mergeSortTree(arr, level, levels) {
        if (!levels[level]) levels[level] = [];
        levels[level].push([...arr]);

        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = await mergeSortTree(arr.slice(0, mid), level + 1, levels);
        const right = await mergeSortTree(arr.slice(mid), level + 1, levels);

        const merged = [...left, ...right];
        return merged;
    }

    async function animateMerge(levels, container) {
        for (let level = levels.length - 1; level > 0; level--) {
            const currentLevel = container.querySelector(`.tree-level:nth-child(${level + 1})`);
            const nextLevel = container.querySelector(`.tree-level:nth-child(${level})`);

            for (let i = 0; i < levels[level].length; i += 2) {
                const left = levels[level][i];
                const right = levels[level][i + 1] || [];
                const result = [];

                let j = 0, k = 0;

                // Get the corresponding blocks in the DOM
                const leftBlock = currentLevel.querySelector(`.array-block:nth-child(${i + 1})`);
                const rightBlock = currentLevel.querySelector(`.array-block:nth-child(${i + 2})`);
                const mergedBlock = nextLevel.querySelector(`.array-block:nth-child(${Math.floor(i / 2) + 1})`);

                while (j < left.length && k < right.length) {
                    const leftItem = leftBlock?.querySelector(`.array-item:nth-child(${j + 1})`);
                    const rightItem = rightBlock?.querySelector(`.array-item:nth-child(${k + 1})`);

                    // Highlight comparing elements
                    if (leftItem) leftItem.classList.add('comparing');
                    if (rightItem) rightItem.classList.add('comparing');
                    await sleep(300); // Faster comparison highlight

                    if (left[j] < right[k]) {
                        result.push(left[j++]);
                    } else {
                        result.push(right[k++]);
                    }

                    // Remove comparison highlight and mark as merged
                    if (leftItem) {
                        leftItem.classList.remove('comparing');
                        leftItem.classList.add('merged');
                    }
                    if (rightItem) {
                        rightItem.classList.remove('comparing');
                        rightItem.classList.add('merged');
                    }
                    await sleep(300); // Faster merge highlight
                }

                // Add remaining elements from left
                while (j < left.length) {
                    const leftItem = leftBlock?.querySelector(`.array-item:nth-child(${j + 1})`);
                    if (leftItem) {
                        leftItem.classList.add('merged');
                    }
                    result.push(left[j++]);
                    await sleep(300);
                }

                // Add remaining elements from right
                while (k < right.length) {
                    const rightItem = rightBlock?.querySelector(`.array-item:nth-child(${k + 1})`);
                    if (rightItem) {
                        rightItem.classList.add('merged');
                    }
                    result.push(right[k++]);
                    await sleep(300);
                }

                // Update the merged block with the final result
                mergedBlock.innerHTML = ''; // Clear previous content
                for (const val of result) {
                    const item = document.createElement('div');
                    item.className = 'array-item merged';
                    item.textContent = val;
                    mergedBlock.appendChild(item);
                }
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});