import os

ROOT = os.getcwd()

MEDIA_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp",
    ".mp4", ".mov", ".avi", ".mkv", ".webm"
}

lines = []

for root, dirs, files in os.walk(ROOT):
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in MEDIA_EXTENSIONS:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, ROOT)
            rel_path = rel_path.replace("\\", "/")
            lines.append(f'      "../{rel_path}",')

lines.sort()

with open("rutas.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("rutas.txt generado con rutas multimedia.")
