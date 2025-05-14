// Función para renderizar los modelos en la cuadrícula
function renderModels(modelsToRender) {
  const grid = document.getElementById("modelGrid");
  const modal = document.getElementById("modelModal");
  const modalName = document.getElementById("modalName");
  const modalHeight = document.getElementById("modalHeight");
  const modalMeasurements = document.getElementById("modalMeasurements");
  const modalGallery = document.getElementById("modalGallery");
  const closeModal = document.getElementById("closeModal");

  modelsToRender.forEach(model => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}">
      <div class="card-body"><h3>${model.name}</h3></div>`;
    
    card.addEventListener("click", () => {
      modalName.textContent = model.name;
      modalHeight.textContent = "Altura: " + model.height;
      modalMeasurements.textContent = "Medidas: " + model.measurements;
      modalGallery.innerHTML = ""; // Limpiar la galería antes de agregar nuevas imágenes
      model.gallery.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        modalGallery.appendChild(img);
      });
      modal.style.display = "flex"; // Mostrar el modal
    });

    grid.appendChild(card); // Agregar la tarjeta a la cuadrícula
  });

  // Cerrar el modal al hacer clic en la 'X'
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar el modal si se hace clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Cargar los modelos cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
  renderModels(models);
});
