// ========== UTILS ==========
function replaceVariante(path, newVar) {
  return path.replace(/\/(mini|full)\//, "/" + newVar + "/");
}
function isVideo(file) {
  return /\.(mp4|webm|mov)$/i.test(file);
}
// ========== MEDIA LOADER ==========
function mediaLoader(mediaPath, alt = "", loading = "lazy", tier = "auto", bigView = false) {
  if (isVideo(mediaPath)) {
    const video = document.createElement("video");
    video.src = mediaPath;
    video.loop = true;
    video.playsInline = true; // Necesario para Safari/iOS
    video.className = "video-thumb";
    
    // Set default states (autoplay+muted for thumbs)
    if (bigView) {
      video.controls = true;
      video.muted = false; // Solo sin mute en bigView, si quieres sonido (el usuario debe dar play)
      video.autoplay = false; // Quita autoplay para evitar errores en Safari al tener sonido
    } else {
      video.controls = false;
      video.muted = true;   // Obligatorio para autoplay cross-browser
      video.autoplay = true;
      // Truco: forzar play para Safari (puede tirar error pero lo ignoramos)
      video.oncanplay = () => {
        video.play().catch(() => {});
      };
    }

    // Estilos
    if (bigView) {
      video.style.width = "auto";
      video.style.height = "auto";
      video.style.maxWidth = "90vw";
      video.style.maxHeight = "80vh";
      video.style.objectFit = "contain";
      video.style.background = "#181818";
      video.style.borderRadius = "14px";
      video.style.display = "block";
    } else {
      video.style.width = "100%";
      video.style.height = "auto";
      video.style.maxHeight = "250px";
      video.style.objectFit = "contain";
      video.style.background = "#232323";
      video.style.borderRadius = "0";
      video.style.display = "block";
    }
    return video;
  }
  return progressiveImageLoader(mediaPath, alt, loading, tier, bigView);
}


// ========== PROGRESSIVE IMAGE LOADER (solo retorna <img>) ==========
function progressiveImageLoader(imgPath, alt = "", loading = "lazy", tier = "auto", bigView = false) {
  const mini = replaceVariante(imgPath, "mini");
  const full = replaceVariante(imgPath, "full");
  let maxTier = "full";
  if (tier === "auto") maxTier = window.innerWidth < 600 ? "mini" : "full";
  else maxTier = tier;

  const img = document.createElement("img");
  img.src = mini;
  img.alt = alt || "Model";
  img.loading = loading;
  img.className = "img-blur";
  img.style.background = bigView ? "#181818" : "";
  img.style.borderRadius = bigView ? "14px" : "0";
  img.style.objectFit = bigView ? "contain" : "cover";
  img.style.maxWidth = bigView ? "90vw" : "100%";
  img.style.maxHeight = bigView ? "80vh" : "auto";
  img.style.display = "block";
  img.style.margin = "auto";

  img.onerror = function () {
    img.onerror = null;
    img.remove();
  };

  img.onload = function onMiniLoaded() {
    img.onload = null;
    if (maxTier === "full") {
      const fullImg = new window.Image();
      fullImg.src = full;
      fullImg.onload = function () {
        img.src = full;
        img.classList.remove("img-blur");
        img.classList.add("img-sharp");
      };
    } else {
      img.classList.remove("img-blur");
      img.classList.add("img-sharp");
    }
  };

  return img;
}

// ========== RENDERIZA EL GRID DE MODELOS ==========
function renderModels(modelsToRender) {
  const grid = document.getElementById("modelGrid");
  grid.innerHTML = "";
  const filtered = modelsToRender.filter(m => m && typeof m.photo === 'string' && m.photo.trim());
  filtered.forEach((model, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.appendChild(mediaLoader(model.photo, model.name, i < 6 ? "eager" : "lazy", "auto", false));
    const body = document.createElement("div");
    body.className = "card-body";
    body.textContent = model.name;
    card.appendChild(body);
    card.addEventListener("click", () => openPolasSection(model, i));
    grid.appendChild(card);
  });
}

// ========== POLAS SECTION ==========
let currentGallery = [];
let currentIndex = 0;
let imgViewerOpen = false;

function openPolasSection(model, modelIdx) {
  const section = document.getElementById("polasSection");
  const name = document.getElementById("polasName");
  const measures = document.getElementById("polasMeasures");
  const gallery = document.getElementById("polasGallery");
  const insta = document.getElementById("instaGallery");

  name.textContent = model.name;
  let measuresHTML = "";
  if (model.height) measuresHTML += `<span class="measure-label">Height</span><span class="measure-value">${model.height}</span>`;
  if (model.measurements) measuresHTML += `<span class="measure-label">Measurements</span><span class="measure-value">${model.measurements}</span>`;
  if (model.bust) measuresHTML += `<span class="measure-label">Bust</span><span class="measure-value">${model.bust}</span>`;
  if (model.waist) measuresHTML += `<span class="measure-label">Waist</span><span class="measure-value">${model.waist}</span>`;
  if (model.hips) measuresHTML += `<span class="measure-label">Hips</span><span class="measure-value">${model.hips}</span>`;
  if (model.eyes) measuresHTML += `<span class="measure-label">Eyes</span><span class="measure-value">${model.eyes}</span>`;
  if (model.hair) measuresHTML += `<span class="measure-label">Hair</span><span class="measure-value">${model.hair}</span>`;
  if (model.shoe) measuresHTML += `<span class="measure-label">Shoe size</span><span class="measure-value">${model.shoe}</span>`;
  if (typeof model.download === "string" && model.download.trim().length > 0) {
    measuresHTML += `<button id="download-book-btn" class="download-book-btn" style="margin-left:16px;padding:6px 15px;font-size:0.95rem;background:#1c1e1f;color:#fff;border:1px solid #ff0000;border-radius:7px;cursor:pointer">Download book</button>`;
  }
  measures.innerHTML = measuresHTML;

  // Bot��n de descarga
  if (model.download) {
    document.getElementById('download-book-btn').addEventListener('click', async function downloadPortfolioZip() {
      const btn = document.querySelector(".download-book-btn");
      const fileUrl = model.download;
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (!fileUrl) {
        alert("Could not download. Please contact Aura Scouting.");
        return;
      }
      btn.textContent = 'Preparing download...';
      btn.disabled = true;
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          if (response.status === 404) throw new Error("The requested book was not found.");
          else if (response.status >= 500) throw new Error("Server error during download. Please try again.");
          else throw new Error("Failed to download the book due to a network issue.");
        }
        const blob = await response.blob();
        saveAs(blob, fileName);
      } catch (error) {
        alert(`Failed to download the book. Please try again later or report it.`);
      } finally {
        btn.textContent = 'Download book';
        btn.disabled = false;
      }
    });
  }

  // Galer��a de polas
  currentGallery = (model.portfolio ?? []).filter(x => typeof x === 'string' && x.trim().length > 0);

  gallery.innerHTML = "";
  if (currentGallery.length === 0) {
    gallery.innerHTML = "<div class='muted text-center'>No photos available for this model.</div>";
  } else {
    currentGallery.forEach((url, idx) => {
      const polaDiv = document.createElement("div");
      polaDiv.className = "pola-pic";
      polaDiv.appendChild(mediaLoader(url, 'Pola', "lazy", "auto", false));
      polaDiv.firstChild.addEventListener('click', () => openImgViewer(idx));
      gallery.appendChild(polaDiv);
    });
  }

  // Instagram
  insta.innerHTML = "";
  (model.instagram ?? []).filter(x => typeof x === "string" && x.trim().length > 0).forEach((url, idx) => {
    const instaImg = document.createElement("img");
    instaImg.src = url;
    instaImg.alt = "Instagram";
    instaImg.loading = "lazy";
    // Solo si tienes una funci��n para el visor de Instagram, si no, quita la l��nea de abajo.
    // instaImg.addEventListener('click', () => openImgViewerIG(idx));
    insta.appendChild(instaImg);
  });

  section.style.display = "flex";
  setTimeout(() => section.classList.add('show'), 10);
}

function closePolasSection() {
  const section = document.getElementById("polasSection");
  section.classList.remove('show');
  setTimeout(() => { section.style.display = "none"; }, 180);
}
document.getElementById("closePolasBtn").onclick = closePolasSection;

// ========== VISOR DE IMAGEN/VIDEO GRANDE ==========
function openImgViewer(idx) {
  currentIndex = idx;
  const viewer = document.getElementById('imgViewer');
  const wrapper = viewer.querySelector('.img-viewer-img');
  if (wrapper) wrapper.innerHTML = "";

  const url = currentGallery[currentIndex];
  const isVid = isVideo(url);
  const media = mediaLoader(
    url,
    "Big Preview",
    "eager",
    window.innerWidth < 600 ? "mini" : "full",
    true
  );
  if (wrapper) wrapper.appendChild(media);

  viewer.style.display = 'flex';
  setTimeout(() => viewer.classList.add('show'), 5);
  document.body.classList.add('body--img-viewer-open');
  imgViewerOpen = true;
  preloadAdjacentImages(currentGallery, currentIndex);

  if (!isVid) {
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.minHeight = "70vh";
    if (media.firstChild) {
      media.firstChild.style.maxWidth = "90vw";
      media.firstChild.style.maxHeight = "80vh";
      media.firstChild.style.objectFit = "contain";
      media.firstChild.style.margin = "auto";
    }
  }
}

function closeImgViewer() {
  const viewer = document.getElementById('imgViewer');
  viewer.querySelectorAll('video').forEach(v => {
    v.pause();
    v.currentTime = 0;
    v.removeAttribute('src');
    v.load();
  });
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
  openImgViewer(currentIndex);
}

document.querySelector('.img-viewer-close').onclick = closeImgViewer;
document.querySelector('.img-viewer-prev').onclick = () => showImgViewerImg(currentIndex - 1);
document.querySelector('.img-viewer-next').onclick = () => showImgViewerImg(currentIndex + 1);
document.getElementById('imgViewer').onclick = function (e) {
  if (e.target === this) closeImgViewer();
};

function preloadAdjacentImages(gallery, idx) {
  [idx - 1, idx + 1].forEach(i => {
    if (gallery[i]) {
      const url = gallery[i];
      if (!isVideo(url)) {
        const img = new window.Image();
        img.src = replaceVariante(url, "full");
      }
    }
  });
}

/// ========== ESCAPE KEY ==========
window.addEventListener('keydown', function (e) {
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

// ========== INIT y Botón de medidas ==========
let isMetric = true;

function convertUnits(text, isHeight = false) {
  if (!text) return "";

  if (!isMetric) {
    // ---------- A SISTEMA IMPERIAL ----------
    if (isHeight) {
      // metros → pies/pulgadas
      text = text.replace(/(\d+(?:\.\d+)?)m\b/gi, (_, val) => {
        const meters = parseFloat(val);
        const totalInches = meters * 100 / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}'${inches}"`;
      });

      // cm → pies/pulgadas
      text = text.replace(/(\d+(?:\.\d+)?)cm\b/gi, (_, val) => {
        const cm = parseFloat(val);
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}'${inches}"`;
      });
    } else {
      // medidas corporales → solo pulgadas con decimal
      text = text.replace(/(\d+(?:\.\d+)?)cm\b/gi, (_, val) => {
        const cm = parseFloat(val);
        const inches = (cm / 2.54).toFixed(1);
        return `${inches}"`;
      });
    }

  } else {
    // ---------- A SISTEMA MÉTRICO ----------

    // pies y pulgadas → cm
    text = text.replace(/(\d+)'(\d+)"/g, (_, feet, inches) => {
      const totalInches = parseInt(feet) * 12 + parseInt(inches);
      const cm = Math.round(totalInches * 2.54);
      return `${cm}cm`;
    });

    // pulgadas solas → cm
    text = text.replace(/(\d+(?:\.\d+)?)"/g, (_, val) => {
      const inches = parseFloat(val);
      const cm = Math.round(inches * 2.54);
      return `${cm}cm`;
    });
  }

  return text;
}

function toggleUnits() {
  isMetric = !isMetric;
  const measures = document.getElementById("polasMeasures");
  if (!measures) return;

  const spans = measures.querySelectorAll(".measure-value");
  spans.forEach((span, i) => {
    const isHeight = i === 0; // solo el primero es altura
    const isMeasurements = i === 1; // el segundo son medidas corporales
    if (isHeight || isMeasurements) {
      span.textContent = convertUnits(span.textContent, isHeight);
    }
  });

  const btn = document.getElementById("toggleUnitBtn");
  if (btn) btn.textContent = isMetric ? "Switch to ft/in" : "Switch to cm/m";
}

document.addEventListener("DOMContentLoaded", () => {
  renderModels(models); // models debe existir global
  document.getElementById("polasSection").style.display = "none";

  const unitBtn = document.getElementById("toggleUnitBtn");
  if (unitBtn) {
    unitBtn.addEventListener("click", toggleUnits);
  }
});
