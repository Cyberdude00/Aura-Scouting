import os
from PIL import Image, ImageFile
from io import BytesIO

# Permitir que PIL cargue imágenes truncadas
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Tamaños máximos en bytes
MINI_MAX = 150 * 1024
MEDIUM_MAX = 450 * 1024

# Crear carpetas mini y medium
os.makedirs("mini", exist_ok=True)
os.makedirs("medium", exist_ok=True)

# Formatos válidos
valid_exts = [".jpg", ".jpeg", ".webp"]

def compress_image(input_path, output_path, max_size):
    img = Image.open(input_path)
    format = 'JPEG' if input_path.lower().endswith(('.jpg', '.jpeg')) else 'WEBP'

    # Convertir RGBA/LA/P a RGB si es JPEG
    if format == 'JPEG' and img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')

    # Reducir resolución si es enorme
    img.thumbnail((2000, 2000), Image.LANCZOS)

    # Probar distintos niveles de calidad
    quality = 95
    while quality >= 10:
        buffer = BytesIO()
        img.save(buffer, format=format, quality=quality, optimize=True)
        if buffer.tell() <= max_size:
            with open(output_path, 'wb') as f:
                f.write(buffer.getvalue())
            return
        quality -= 5

    # Si no se logra, guardar lo mejor posible
    img.save(output_path, format=format, quality=quality, optimize=True)

# Procesar imágenes
for file in os.listdir():
    ext = os.path.splitext(file)[1].lower()
    if ext not in valid_exts:
        continue

    input_path = os.path.abspath(file)

    # Salidas con mismo nombre
    mini_path = os.path.join("mini", file)
    medium_path = os.path.join("medium", file)

    print(f"🔄 Procesando {file}...")

    compress_image(input_path, mini_path, MINI_MAX)
    compress_image(input_path, medium_path, MEDIUM_MAX)

print("✅ Todo listo. Archivos comprimidos en /mini y /medium.")
