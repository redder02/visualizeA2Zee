import os

# Define the folder structure and default content
VISUALIZATIONS = [
    "bubble-sort",
    "binary-search",
    "selection-sort",
    "insertion-sort",
    "linked-list-reversal"
]

# Default content for each file
DEFAULT_HTML = """
<!-- Input Section -->
<div class="flex flex-col md:flex-row gap-4 mb-6">
    <input type="text" id="input" placeholder="Enter input (e.g., 4,3,2,1)" 
           class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
           value="4,3,2,1">
    <button id="start-visualization" 
            class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
        Start Visualization
    </button>
</div>
"""

DEFAULT_JS = """
document.getElementById('start-visualization').addEventListener('click', () => {
    const input = document.getElementById('input').value.trim().split(',').map(Number);
    if (!input || input.some(isNaN)) {
        alert("Please enter valid comma-separated numbers.");
        return;
    }

    const area = document.getElementById('visualization-area');
    area.innerHTML = '';

    const maxValue = Math.max(...input);

    // Create bars for the array
    const bars = input.map(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(value / maxValue) * 100}%`;
        area.appendChild(bar);
        return bar;
    });

    // Animation logic goes here...
});
"""

DEFAULT_CSS = """
/* Visualization-specific styles */
.bar {
    background-color: #4CAF50;
}
"""

# Function to create folders and files
def setup_visualizations():
    # Root folder
    root_folder = "visualizea2z"
    os.makedirs(root_folder, exist_ok=True)

    # Static folder
    static_folder = os.path.join(root_folder, "static")
    os.makedirs(static_folder, exist_ok=True)

    # CSS folder
    css_folder = os.path.join(static_folder, "css")
    os.makedirs(css_folder, exist_ok=True)

    # GIFs folder
    gifs_folder = os.path.join(static_folder, "gifs")
    os.makedirs(gifs_folder, exist_ok=True)

    # Visualizations folder
    visualizations_folder = os.path.join(root_folder, "visualizations")
    os.makedirs(visualizations_folder, exist_ok=True)

    # Create visualization folders and files
    for slug in VISUALIZATIONS:
        vis_folder = os.path.join(visualizations_folder, slug)
        os.makedirs(vis_folder, exist_ok=True)

        # Create index.html
        html_file = os.path.join(vis_folder, "index.html")
        if not os.path.exists(html_file):
            with open(html_file, "w") as f:
                f.write(DEFAULT_HTML.strip())

        # Create script.js
        js_file = os.path.join(vis_folder, "script.js")
        if not os.path.exists(js_file):
            with open(js_file, "w") as f:
                f.write(DEFAULT_JS.strip())

        # Create style.css
        css_file = os.path.join(vis_folder, "style.css")
        if not os.path.exists(css_file):
            with open(css_file, "w") as f:
                f.write(DEFAULT_CSS.strip())

    print("Visualization setup complete!")

# Run the setup
if __name__ == "__main__":
    setup_visualizations()