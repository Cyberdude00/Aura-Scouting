// --- renderiza el grid principal, siempre 5 slots ---
function renderModels(modelsToRender) {
  const grid = document.getElementById("modelGrid");
  grid.innerHTML = "";
  for (let i = 0; i < 5; i++) {
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

  // Medidas con labels rojas
  measures.innerHTML = `
    <span class="measure-label">Altura</span>
    <span class="measure-value">${model.height}</span>
    <span class="measure-label">Medidas</span>
    <span class="measure-value">${model.measurements}</span>
  `;

  // Polas gallery
  gallery.innerHTML = model.portfolio.map((url, idx) =>
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
document.getElementById("closePolasBtn").onclick = () => {
  const section = document.getElementById("polasSection");
  section.classList.remove('show');
  setTimeout(() => {
    section.style.display = "none";
    document.body.classList.remove('modal-open');
  }, 180);
};

// ------- VIEWER PARA LA IMAGEN GRANDE -------
let currentGallery = [];
let currentIndex = 0;

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
}
function closeImgViewer() {
  const viewer = document.getElementById('imgViewer');
  viewer.style.display = 'none';
  viewer.classList.remove('show');
  document.body.classList.remove('modal-open');
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
window.addEventListener('keydown', function(e){
  const viewer = document.getElementById('imgViewer');
  if(viewer.style.display !== 'flex') return;
  if(e.key === 'Escape') closeImgViewer();
  if(e.key === 'ArrowRight') showImgViewerImg(currentIndex + 1);
  if(e.key === 'ArrowLeft') showImgViewerImg(currentIndex - 1);
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
