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
    background-color: #ef4444;
}
.array-item.merged {
    background-color: #10b981;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');

    const vizArea = document.getElementById('visualization-area');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter comma-separated numbers';
    input.value = '8, 4, 7, 6, 5, 3, 2, 1';
    input.className = 'flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600';

    const button = document.createElement('button');
    button.textContent = 'Start Merge Sort';
    button.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600';

    inputSection.appendChild(input);
    inputSection.appendChild(button);

    button.addEventListener('click', () => {
        const raw = input.value.trim();
        const values = raw.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

        if (!values.length) return alert('Please enter valid numbers.');

        vizArea.innerHTML = '';
        buildMergeTree(values, vizArea);
    });

    async function buildMergeTree(arr, container) {
        const levels = [];
        await splitForTree(arr, 0, levels);

        for (let i = 0; i < levels.length; i++) {
            const row = document.createElement('div');
            row.className = 'tree-level';
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
            await sleep(500);
        }

        await animateFakeMerge(levels, container);
    }

    async function splitForTree(arr, level, levels) {
        if (!levels[level]) levels[level] = [];
        levels[level].push([...arr]);

        if (arr.length <= 1) return;

        const mid = Math.floor(arr.length / 2);
        await splitForTree(arr.slice(0, mid), level + 1, levels);
        await splitForTree(arr.slice(mid), level + 1, levels);
    }

    async function animateFakeMerge(levels, container) {
        for (let level = levels.length - 1; level > 0; level--) {
            const currentLevel = container.querySelector(`.tree-level:nth-child(${level + 1})`);
            const nextLevel = container.querySelector(`.tree-level:nth-child(${level})`);

            for (let i = 0; i < levels[level].length; i += 2) {
                const left = levels[level][i] || [];
                const right = levels[level][i + 1] || [];

                const leftBlock = currentLevel.querySelector(`.array-block:nth-child(${i + 1})`);
                const rightBlock = currentLevel.querySelector(`.array-block:nth-child(${i + 2})`);
                const mergedBlock = nextLevel.querySelector(`.array-block:nth-child(${Math.floor(i / 2) + 1})`);

                const merged = [...left, ...right].sort((a, b) => a - b); // Sort using built-in sort

                // Fake animation: highlight and then show merged
                let j = 0, k = 0;
                while (j < left.length && k < right.length) {
                    const leftItem = leftBlock?.querySelector(`.array-item:nth-child(${j + 1})`);
                    const rightItem = rightBlock?.querySelector(`.array-item:nth-child(${k + 1})`);

                    if (leftItem) leftItem.classList.add('comparing');
                    if (rightItem) rightItem.classList.add('comparing');
                    await sleep(200);

                    if (left[j] < right[k]) {
                        if (leftItem) {
                            leftItem.classList.remove('comparing');
                            leftItem.classList.add('merged');
                        }
                        j++;
                    } else {
                        if (rightItem) {
                            rightItem.classList.remove('comparing');
                            rightItem.classList.add('merged');
                        }
                        k++;
                    }
                    await sleep(200);
                }

                while (j < left.length) {
                    const leftItem = leftBlock?.querySelector(`.array-item:nth-child(${j + 1})`);
                    if (leftItem) leftItem.classList.add('merged');
                    j++;
                    await sleep(200);
                }

                while (k < right.length) {
                    const rightItem = rightBlock?.querySelector(`.array-item:nth-child(${k + 1})`);
                    if (rightItem) rightItem.classList.add('merged');
                    k++;
                    await sleep(200);
                }

                mergedBlock.innerHTML = '';
                for (const val of merged) {
                    const item = document.createElement('div');
                    item.className = 'array-item merged';
                    item.textContent = val;
                    mergedBlock.appendChild(item);
                }

                await sleep(500);
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
