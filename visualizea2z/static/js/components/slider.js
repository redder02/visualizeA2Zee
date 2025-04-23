export function createSpeedSlider(defaultValue = 500, min = 100, max = 4000, onChange) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = defaultValue;
    slider.classList.add('w-full');

    slider.addEventListener('input', () => {
        const value = parseInt(slider.value, 10);
        onChange(value);
    });

    return slider;
}