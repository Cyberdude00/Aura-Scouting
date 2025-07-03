document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('image_attachment');
    const imagePreview = document.getElementById('img-preview');

    // Ensure the logo is visible initially
    imagePreview.style.display = 'block';

    fileInput.addEventListener('change', function(event) {
        console.log('File input change event fired!');
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            console.log('File selected:', file.name, file.type, file.size);
            // Check if the selected file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader(); // Create a new FileReader object

                reader.onload = function(e) {
                    console.log('FileReader onload event fired!');
                    // When the file is loaded, set the src of the image preview
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block'; // Ensure image is visible
                    console.log('Image source updated.');
                };

                reader.onerror = function() {
                    console.error('FileReader error:', reader.error);
                    alert('Could not read the file. Please try again.');
                    imagePreview.src = '../images/aura-scouting-logo.png'; // Revert to default
                    imagePreview.style.display = 'block';
                };

                reader.readAsDataURL(file); // Read the file as a data URL (base64 encoded)
                console.log('Called reader.readAsDataURL()');
            } else {
                // If it's not an image, revert to default and show error
                alert('Invalid file type. Only JPG, PNG, and GIF images are allowed.');
                imagePreview.src = '../images/aura-scouting-logo.png'; // Revert to default image
                imagePreview.style.display = 'block';
                fileInput.value = ''; // Clear the input field to allow re-selection
                console.log('Invalid file type.');
            }
        } else {
            // No file selected (e.g., user cancelled file dialog), revert to default logo
            imagePreview.src = '../images/aura-scouting-logo.png';
            imagePreview.style.display = 'block';
            console.log('No file selected, reverting to default.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const emailForm = document.getElementById('emailForm');
  const submitButton = document.getElementById('submitButton');
  const buttonText = document.getElementById('buttonText');
  const loadingSpinner = document.getElementById('loadingSpinner');

  emailForm.addEventListener('submit', function() {
    // Show loading spinner and disable button
    buttonText.textContent = 'Sending...';
    loadingSpinner.classList.remove('hidden');
    submitButton.disabled = true;
    submitButton.classList.add('opacity-75', 'cursor-not-allowed');
  });

  // If the page reloads (due to redirect from send_email.php),
  // ensure the button is re-enabled and spinner hidden.
  // This handles cases where the user might navigate back or refresh.
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) { // Check if page is loaded from cache (e.g., back button)
      buttonText.textContent = 'Send Email';
      loadingSpinner.classList.add('hidden');
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  });
});
