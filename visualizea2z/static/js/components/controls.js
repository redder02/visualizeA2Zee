import { createButton } from './buttons.js';
import { createSpeedSlider } from './slider.js';

export function createControlBar({
    onPlayPause,
    onStepForward,
    onStepBackward,
    onSpeedChange,
    defaultSpeed = 500,
}) {
    const controlBar = document.createElement('div');
    controlBar.classList.add('flex', 'items-center', 'justify-center', 'space-x-2', 'p-2', 'bg-gray-800', 'rounded');

    // Step Backward Button
    const stepBackwardButton = createButton('step-backward', `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
    `, onStepBackward);

    // Play/Pause Button
    const playPauseButton = createButton('play-pause', `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="white" />
            <path id="play-icon" fill="black" d="M10 8v8l6-4z" />
            <path id="pause-icon" fill="black" d="M10 8h2v8h-2zm4 0h2v8h-2z" style="display: none;" />
        </svg>
    `, onPlayPause);

    // Step Forward Button
    const stepForwardButton = createButton('step-forward', `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
    `, onStepForward);

    // Speed Slider
    const speedSlider = createSpeedSlider(defaultSpeed, 100, 4000, onSpeedChange);

    // Append elements to the control bar
    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('flex-grow', 'mx-4');
    sliderContainer.appendChild(speedSlider);

    controlBar.appendChild(stepBackwardButton);
    controlBar.appendChild(playPauseButton);
    controlBar.appendChild(stepForwardButton);
    controlBar.appendChild(sliderContainer);

    return controlBar;
}