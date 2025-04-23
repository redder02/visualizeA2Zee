export function createButton(id, iconHTML, onClick, classes = 'p-2 text-white hover:bg-gray-700 rounded-full') {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add(...classes.split(' '));
    button.innerHTML = iconHTML;
    button.addEventListener('click', onClick);
    return button;
}

export function createStartButton(onClick, text = 'Start Animation', classes = 'p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2') {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(...classes.split(' '));
    button.addEventListener('click', onClick);
    return button;
}