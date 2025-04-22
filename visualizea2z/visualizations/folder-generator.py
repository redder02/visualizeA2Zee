import os

folder_name = 'factorial'
files = ['script.js', 'index.html', 'style.css']

os.makedirs(folder_name, exist_ok=True)

for file in files:
    file_path = os.path.join(folder_name, file)
    with open(file_path, 'w') as f:
        f.write('')

print('successfull')