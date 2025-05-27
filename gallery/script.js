// --- renderiza el grid principal, muestra TODOS los modelos ---
function renderModels(modelsToRender) {
  const grid = document.getElementById("modelGrid");
  grid.innerHTML = "";
  for (let i = 0; i < modelsToRender.length; i++) {
    const model = modelsToRender[i];
    const card = document.createElement("div");
    card.className = model ? "card" : "card empty";
    if (model) {
      // Imagen principal del modelo con lazy load
      card.innerHTML = `
        <img src="${model.photo}" alt="${model.name}" loading="lazy">
        <div class="card-body">${model.name}</div>`;
      card.addEventListener("click", () => openPolasSection(model, i));
    } else {
      card.innerHTML = "&nbsp;";
    }
    grid.appendChild(card);
  }
  // Lazy load for any other images (in case)
  lazyLoadAllImages();
}

// --- abre la sección de polas (modal página completa) ---
function openPolasSection(model, modelIdx) {
  const section = document.getElementById("polasSection");
  const name = document.getElementById("polasName");
  const measures = document.getElementById("polasMeasures");
  const gallery = document.getElementById("polasGallery");
  const insta = document.getElementById("instaGallery");

  // Nombre
  name.innerHTML = model.name;

  // Medidas con labels rojas, SOLO muestra los campos que existan
  let measuresHTML = "";
  if (model.height) {
    measuresHTML += `<span class="measure-label">Height</span>
                     <span class="measure-value">${model.height}</span>`;
  }
  if (model.measurements) {
    measuresHTML += `<span class="measure-label">Measurements</span>
                     <span class="measure-value">${model.measurements}</span>`;
  }
  if (model.bust) {
    measuresHTML += `<span class="measure-label">Bust</span>
                     <span class="measure-value">${model.bust}</span>`;
  }
  if (model.waist) {
    measuresHTML += `<span class="measure-label">Waist</span>
                     <span class="measure-value">${model.waist}</span>`;
  }
  if (model.hips) {
    measuresHTML += `<span class="measure-label">Hips</span>
                     <span class="measure-value">${model.hips}</span>`;
  }
  if (model.eyes) {
    measuresHTML += `<span class="measure-label">Eyes</span>
                     <span class="measure-value">${model.eyes}</span>`;
  }
  if (model.hair) {
    measuresHTML += `<span class="measure-label">Hair</span>
                     <span class="measure-value">${model.hair}</span>`;
  }
  if (model.shoe) {
    measuresHTML += `<span class="measure-label">Shoe size</span>
                     <span class="measure-value">${model.shoe}</span>`;
  }
  measures.innerHTML = measuresHTML;

  // Polas gallery
  gallery.innerHTML = (model.portfolio ?? []).map((url, idx) =>
    `<img src="${url}" alt="Pola" loading="lazy" onclick="openImgViewer(models[${modelIdx}].portfolio,${idx})">`
  ).join('');
  // Instagram gallery
  insta.innerHTML = (model.instagram ?? []).map((url, idx) =>
    `<img src="${url}" alt="Instagram" loading="lazy" onclick="openImgViewer(models[${modelIdx}].instagram,${idx})">`
  ).join('');
  document.body.classList.add('modal-open');
  section.style.display = "flex";
  setTimeout(() => section.classList.add('show'), 10);

  // Asegura lazy load por si hay imágenes nuevas
  lazyLoadAllImages();
}

// Cierra la sección polas
function closePolasSection() {
  const section = document.getElementById("polasSection");
  section.classList.remove('show');
  setTimeout(() => {
    section.style.display = "none";
    document.body.classList.remove('modal-open');
  }, 180);
}
document.getElementById("closePolasBtn").onclick = closePolasSection;

// ------- VIEWER PARA LA IMAGEN GRANDE -------
let currentGallery = [];
let currentIndex = 0;
let imgViewerOpen = false;

function openImgViewer(gallery, idx) {
  currentGallery = gallery;
  currentIndex = idx;
  const viewer = document.getElementById('imgViewer');
  const img = viewer.querySelector('.img-viewer-img');
  img.src = currentGallery[currentIndex];
  img.setAttribute('loading', 'lazy');
  viewer.style.display = 'flex';
  setTimeout(() => viewer.classList.add('show'), 5);
  document.body.classList.add('modal-open');
  imgViewerOpen = true;
}
function closeImgViewer() {
  const viewer = document.getElementById('imgViewer');
  viewer.style.display = 'none';
  viewer.classList.remove('show');
  document.body.classList.remove('modal-open');
  imgViewerOpen = false;
}
function showImgViewerImg(idx) {
  const img = document.querySelector('.img-viewer-img');
  currentIndex = ((idx % currentGallery.length) + currentGallery.length) % currentGallery.length;
  img.src = currentGallery[currentIndex];
  img.setAttribute('loading', 'lazy');
}
document.querySelector('.img-viewer-close').onclick = closeImgViewer;
document.querySelector('.img-viewer-prev').onclick = () => showImgViewerImg(currentIndex - 1);
document.querySelector('.img-viewer-next').onclick = () => showImgViewerImg(currentIndex + 1);
document.getElementById('imgViewer').onclick = function(e){
  if(e.target === this) closeImgViewer();
}

// === ESCAPE para cerrar viewer o galería ===
window.addEventListener('keydown', function(e){
  const viewer = document.getElementById('imgViewer');
  const polasSection = document.getElementById('polasSection');

  // Si está abierto el viewer, ESC lo cierra
  if (viewer.style.display === 'flex' && imgViewerOpen) {
    if (e.key === 'Escape') closeImgViewer();
    if (e.key === 'ArrowRight') showImgViewerImg(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImgViewerImg(currentIndex - 1);
    return;
  }
  // Si está abierta la galería y no el viewer, ESC cierra la galería
  if (polasSection.style.display === 'flex' && !imgViewerOpen) {
    if (e.key === 'Escape') closePolasSection();
  }
});

// --- LAZY LOAD UNIVERSAL ---
function lazyLoadAllImages() {
  // Asigna loading="lazy" a cualquier <img> que no lo tenga ya
  document.querySelectorAll("img:not([loading])").forEach(function(img) {
    img.setAttribute("loading", "lazy");
  });
}

// --- INICIALIZA ---
document.addEventListener("DOMContentLoaded", () => {
  renderModels(models);
  document.getElementById("polasSection").style.display = "none";
  lazyLoadAllImages();
});
