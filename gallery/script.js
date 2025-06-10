// Utilidad para reemplazar solo la variante de calidad en la ruta (sin tocar "book", "polas", etc)
function replaceVariante(path, newVar) {
  return path.replace(/\/(mini|medium|full)\//, "/" + newVar + "/");
}

// Funci¨®n robusta de carga de im¨¢genes (prioriza mini > medium > full, extensiones .webp > .jpg > .jpeg)
function getPictureHTML(imgPath, alt = "", loading = "lazy") {
  const candidates = [
    replaceVariante(imgPath, "mini").replace(/\.(webp|jpg|jpeg)$/, ".webp"),
    replaceVariante(imgPath, "mini").replace(/\.(webp|jpg|jpeg)$/, ".jpg"),
    replaceVariante(imgPath, "mini").replace(/\.(webp|jpg|jpeg)$/, ".jpeg"),
    replaceVariante(imgPath, "medium").replace(/\.(webp|jpg|jpeg)$/, ".webp"),
    replaceVariante(imgPath, "medium").replace(/\.(webp|jpg|jpeg)$/, ".jpg"),
    replaceVariante(imgPath, "medium").replace(/\.(webp|jpg|jpeg)$/, ".jpeg"),
    replaceVariante(imgPath, "full").replace(/\.(webp|jpg|jpeg)$/, ".webp"),
    replaceVariante(imgPath, "full").replace(/\.(webp|jpg|jpeg)$/, ".jpg"),
    replaceVariante(imgPath, "full").replace(/\.(webp|jpg|jpeg)$/, ".jpeg"),
  ];
  const uniqueCandidates = [...new Set(candidates)];

  let onErrorScript = "";
  for (let i = 1; i < uniqueCandidates.length; i++) {
    onErrorScript += `
      this.onerror=null;
      this.src='${uniqueCandidates[i]}';
    `;
  }
  onErrorScript += `
    console.warn('No se encontr¨® ninguna variante para la imagen: ${imgPath}');
    this.style.display = 'none';
  `;

  return `<img src="${uniqueCandidates[0]}" alt="${alt}" loading="${loading}" style="width:100%;display:block;border-radius:6px;" onerror="${onErrorScript}" />`;
}

// --- RENDERIZA EL GRID DE MODELOS ---
function renderModels(modelsToRender) {
  const grid = document.getElementById("modelGrid");
  grid.innerHTML = "";

  for (let i = 0; i < Math.min(6, modelsToRender.length); i++) {
    const model = modelsToRender[i];
    const card = document.createElement("div");
    card.className = model ? "card" : "card empty";
    if (model) {
      card.innerHTML = `
        ${getPictureHTML(model.photo, model.name, "eager")}
        <div class="card-body">${model.name}</div>`;
      card.addEventListener("click", () => openPolasSection(model, i));
    } else {
      card.innerHTML = "&nbsp;";
    }
    grid.appendChild(card);
  }

  setTimeout(() => {
    for (let i = 6; i < modelsToRender.length; i++) {
      const model = modelsToRender[i];
      const card = document.createElement("div");
      card.className = model ? "card" : "card empty";
      if (model) {
        card.innerHTML = `
          ${getPictureHTML(model.photo, model.name, "lazy")}
          <div class="card-body">${model.name}</div>`;
        card.addEventListener("click", () => openPolasSection(model, i));
      } else {
        card.innerHTML = "&nbsp;";
      }
      grid.appendChild(card);
    }
    lazyLoadAllImages();
  }, 200);

  lazyLoadAllImages();
}

// --- MODAL POLAS (2do nivel) ---
let currentGallery = [];
let currentIndex = 0;
let imgViewerOpen = false;

function openPolasSection(model, modelIdx) {
  const section = document.getElementById("polasSection");
  const name = document.getElementById("polasName");
  const measures = document.getElementById("polasMeasures");
  const gallery = document.getElementById("polasGallery");
  const insta = document.getElementById("instaGallery");

  name.innerHTML = model.name;
  let measuresHTML = "";
  if (model.height) measuresHTML += `<span class="measure-label">Height</span><span class="measure-value">${model.height}</span>`;
  if (model.measurements) measuresHTML += `<span class="measure-label">Measurements</span><span class="measure-value">${model.measurements}</span>`;
  if (model.bust) measuresHTML += `<span class="measure-label">Bust</span><span class="measure-value">${model.bust}</span>`;
  if (model.waist) measuresHTML += `<span class="measure-label">Waist</span><span class="measure-value">${model.waist}</span>`;
  if (model.hips) measuresHTML += `<span class="measure-label">Hips</span><span class="measure-value">${model.hips}</span>`;
  if (model.eyes) measuresHTML += `<span class="measure-label">Eyes</span><span class="measure-value">${model.eyes}</span>`;
  if (model.hair) measuresHTML += `<span class="measure-label">Hair</span><span class="measure-value">${model.hair}</span>`;
  if (model.shoe) measuresHTML += `<span class="measure-label">Shoe size</span><span class="measure-value">${model.shoe}</span>`;
  measures.innerHTML = measuresHTML;

  // Aqu¨ª se filtra la galer¨ªa ANTES de abrir el viewer
  currentGallery = (model.portfolio ?? []).filter(x => !!x && typeof x === 'string' && x.trim().length > 0);

  gallery.innerHTML = currentGallery.map((url, idx) =>
    `<div class="pola-pic" onclick="openImgViewer(${idx})">
      ${getPictureHTML(url, 'Pola')}
    </div>`
  ).join('');

  insta.innerHTML = (model.instagram ?? []).map((url, idx) =>
    `<img src="${url}" alt="Instagram" loading="lazy" onclick="openImgViewerIG(${idx})">`
  ).join('');

  section.style.display = "flex";
  setTimeout(() => section.classList.add('show'), 10);

  lazyLoadAllImages();
}

function closePolasSection() {
  const section = document.getElementById("polasSection");
  section.classList.remove('show');
  setTimeout(() => { section.style.display = "none"; }, 180);
}
document.getElementById("closePolasBtn").onclick = closePolasSection;

// ------- VISOR DE IMAGEN GRANDE (3er nivel) -------
function openImgViewer(idx) {
  currentIndex = idx;
  const viewer = document.getElementById('imgViewer');
  const img = viewer.querySelector('.img-viewer-img');
  img.src = currentGallery[currentIndex];
  img.setAttribute('loading', 'lazy');
  viewer.style.display = 'flex';
  setTimeout(() => viewer.classList.add('show'), 5);
  document.body.classList.add('body--img-viewer-open');
  imgViewerOpen = true;
  preloadAdjacentImages(currentGallery, currentIndex);
}
function closeImgViewer() {
  const viewer = document.getElementById('imgViewer');
  viewer.style.display = 'none';
  viewer.classList.remove('show');
  document.body.classList.remove('body--img-viewer-open');
  imgViewerOpen = false;
}
function showImgViewerImg(idx) {
  if (!currentGallery.length) return;
  if (idx < 0) idx = currentGallery.length - 1;
  if (idx >= currentGallery.length) idx = 0;
  currentIndex = idx;
  const img = document.querySelector('.img-viewer-img');
  img.src = currentGallery[currentIndex];
  img.setAttribute('loading', 'lazy');
  preloadAdjacentImages(currentGallery, currentIndex);
}
document.querySelector('.img-viewer-close').onclick = closeImgViewer;
document.querySelector('.img-viewer-prev').onclick = () => showImgViewerImg(currentIndex - 1);
document.querySelector('.img-viewer-next').onclick = () => showImgViewerImg(currentIndex + 1);
document.getElementById('imgViewer').onclick = function(e){
  if(e.target === this) closeImgViewer();
}
function preloadAdjacentImages(gallery, idx) {
  [idx - 1, idx + 1].forEach(i => {
    if (gallery[i]) {
      const img = new window.Image();
      img.src = gallery[i];
    }
  });
}

// ESCAPE para cerrar viewer o galer¨ªa
window.addEventListener('keydown', function(e){
  const viewer = document.getElementById('imgViewer');
  const polasSection = document.getElementById('polasSection');
  if (viewer.style.display === 'flex' && imgViewerOpen) {
    if (e.key === 'Escape') closeImgViewer();
    if (e.key === 'ArrowRight') showImgViewerImg(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImgViewerImg(currentIndex - 1);
    return;
  }
  if (polasSection.style.display === 'flex' && !imgViewerOpen) {
    if (e.key === 'Escape') closePolasSection();
  }
});

// --- LAZY LOAD UNIVERSAL ---
function lazyLoadAllImages() {
  document.querySelectorAll("img:not([loading])").forEach(function(img) {
    img.setAttribute("loading", "lazy");
  });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  renderModels(models); // models debe existir global
  document.getElementById("polasSection").style.display = "none";
  lazyLoadAllImages();
  // NO llamamos enableSmoothSwipe, porque NO queremos swipe
});
