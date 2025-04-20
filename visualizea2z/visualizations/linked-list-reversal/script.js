document.getElementById('start-visualization').addEventListener('click', () => {
    const input = document.getElementById('input').value.trim().split(',').map(Number);

    if (!input || input.some(isNaN)) {
        alert("Please enter valid comma-separated numbers.");
        return;
    }

    const area = document.getElementById('visualization-area');
    area.innerHTML = '';
    area.style.setProperty('--num-bars', input.length);

    // Create nodes as circles
    const nodes = input.map(value => {
        const node = document.createElement('div');
        node.textContent = value;
        node.classList.add('bar');
        node.style.width = 'calc(100% / var(--num-bars))';
        node.style.height = '40px';
        node.style.borderRadius = '50%';
        area.appendChild(node);
        return node;
    });

    // Reverse the linked list
    let prev = null, curr = 0, next = 1;
    const reverseInterval = setInterval(() => {
        if (curr >= nodes.length) {
            clearInterval(reverseInterval);
            return;
        }

        nodes[curr].style.backgroundColor = 'red';

        setTimeout(() => {
            if (prev !== null) {
                nodes[prev].style.backgroundColor = '#4CAF50';
            }
            prev = curr;
            curr = next;
            next = next + 1;
        }, 1000);
    }, 1500);
});