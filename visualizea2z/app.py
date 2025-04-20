import os
from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)

# Dynamically load visualizations from the "visualizations/" folder
def load_visualizations():
    visualizations_folder = os.path.join(os.getcwd(), 'visualizations')
    dsa_visualizations = []
    for slug in os.listdir(visualizations_folder):
        if os.path.isdir(os.path.join(visualizations_folder, slug)):
            dsa_visualizations.append({
                "slug": slug,
                "title": slug.replace('-', ' ').title(),
                "description": f"Description for {slug.replace('-', ' ').title()}",
                "gif": f"/static/gifs/{slug}.gif"
            })
    return dsa_visualizations

dsa_visualizations = load_visualizations()

@app.route('/')
def home():
    query = request.args.get('query', '').lower()
    category = request.args.get('category', '').lower()

    filtered_visualizations = [
        viz for viz in dsa_visualizations
        if (not query or query in viz['title'].lower()) and
           (not category or category in viz['title'].lower())
    ]
    return render_template('index.html', visualizations=filtered_visualizations)

@app.route('/visualize/<slug>')
def visualize(slug):
    visualization = next((viz for viz in dsa_visualizations if viz['slug'] == slug), None)
    if not visualization:
        return "Visualization not found", 404
    return render_template('visualize.html', visualization=visualization)

# Serve visualization-specific JavaScript files
@app.route('/visualizations/<slug>/script.js')
def serve_script(slug):
    visualizations_folder = os.path.join(os.getcwd(), 'visualizations')
    return send_from_directory(os.path.join(visualizations_folder, slug), 'script.js')

if __name__ == '__main__':
    app.run(debug=True)