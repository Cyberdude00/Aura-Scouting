document.addEventListener('DOMContentLoaded', () => {
    const attachmentInput = document.getElementById('attachment');
    const imagePreview = document.getElementById('image-preview');

    attachmentInput.addEventListener('change', function(event) {
        const [file] = event.target.files;

        if (file) {
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = 'block'; // Show the image
            // Optional: Add a class for a larger preview based on some condition
            // imagePreview.classList.add('large-preview');
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none'; // Hide if no file is selected
            // imagePreview.classList.remove('large-preview');
        }
    });
});
