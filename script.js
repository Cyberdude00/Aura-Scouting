// Formulario modelo: vista previa y validación
const form = document.getElementById("applicationForm");
const fileInput = document.getElementById("photo");
const previewImg = document.querySelector(".img-preview");
const container = document.querySelector(".picture-to-upload");
const uploadText = document.getElementById("uploadText");
const emailInput = document.getElementById("email");
const heightInput = document.getElementById("height");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      container.classList.add("previewing");
      uploadText.textContent = ""; // clear text if image selected
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let hasError = false;

  // Reset styles
  emailInput.placeholder = "Email*";
  heightInput.placeholder = "Height*";
  emailInput.classList.remove("error-placeholder");
  heightInput.classList.remove("error-placeholder");
  uploadText.textContent = "Take a Pic";

  // Check photo
  if (fileInput.files.length === 0) {
    uploadText.textContent = "The upload file is required";
    hasError = true;
  }

  // Check email
  if (emailInput.value.trim() === "") {
    emailInput.placeholder = "Email can’t be blank";
    emailInput.classList.add("error-placeholder");
    hasError = true;
  }

  // Check height
  if (heightInput.value.trim() === "") {
    heightInput.placeholder = "Height can’t be blank";
    heightInput.classList.add("error-placeholder");
    hasError = true;
  }

  if (!hasError) {
    alert("Form ready to send (backend integration needed)");
    // Aquí va la lógica para enviar al backend
  }
});
