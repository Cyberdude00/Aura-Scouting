// Smooth scroll para enlaces internos
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a[href^="#"], a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, targetId);
      }
    });
  });
});

// ----- FORMULARIO DE CONTACTO -----
const form = document.getElementById("applicationForm");
const fileInput = document.getElementById("photo");
const previewImg = document.querySelector(".img-preview");
const container = document.querySelector(".picture-to-upload");
const uploadText = document.getElementById("uploadText");
const emailInput = document.getElementById("email");
const heightInput = document.getElementById("height");

if(form) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        container.classList.add("previewing");
        uploadText.textContent = "";
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    emailInput.placeholder = "Email*";
    heightInput.placeholder = "Height*";
    emailInput.classList.remove("error-placeholder");
    heightInput.classList.remove("error-placeholder");
    uploadText.textContent = "Take a Pic";

    if (fileInput.files.length === 0) {
      uploadText.textContent = "The upload file is required";
      hasError = true;
    }

    if (emailInput.value.trim() === "") {
      emailInput.placeholder = "Email can’t be blank";
      emailInput.classList.add("error-placeholder");
      hasError = true;
    }

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
}
