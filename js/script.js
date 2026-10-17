/*
 * CalonCEO portfolio interactions and editable content.
 * Update siteConfig and the gallery arrays below; the page structure can stay as-is.
 */

const siteConfig = {
  // Gunakan URL profil publik yang benar. Email cukup ditulis "nama@domain.com". Biarkan string kosong sampai siap dipublikasikan.
  links: {
    github: "",
    email: "",
    instagram: "",
    youtube: ""
  }
};

/*
 * Add a photo object here for each original work:
 * {
 *   src: "images/photography/nama-foto.jpg",
 *   title: "Judul foto",
 *   description: "Deskripsi singkat yang benar.",
 *   category: "Nature / Street / Portrait",
 *   device: "Opsional: perangkat yang digunakan",
 *   technique: "Opsional: teknik yang digunakan"
 * }
 */
const photographyItems =  [
  {
   src: "images/photography/bukti-juara.jpg",
  title: "Foto saya juara 1 lomba poster digital",
    description: "Saya mendapatkan juara 1 lomba poster digital di MTs 02 Tegalsari.",
   category: "Null",
    device: "Null",
   technique: "Null"
  }
  ];

/*
 * Add a video object here for each original work:
 * {
 *   title: "Judul video",
 *   description: "Deskripsi singkat yang benar.",
 *   category: "Cinematic / Dokumentasi / Short video / Eksperimen visual",
 *   thumbnail: "images/videography/nama-thumbnail.jpg",
 *   videoUrl: "https://youtu.be/ID_VIDEO" // or "videos/nama-video.mp4"
 * }
 * Local MP4s should be small enough for a static site; large videos are better hosted elsewhere.
 */
const videographyItems = [];

const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function isLocalAssetPath(value) {
  if (typeof value !== "string" || value.trim() === "") return false;
  const path = value.trim();
  // Do not treat schemes such as javascript: or data: as local files.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//")) return false;
  return !path.startsWith("/")
    && !path.startsWith("\\")
    && !path.split("/").includes("..");
}

function isSafePublicUrl(value, allowMailto = false) {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    const parsed = new URL(value, window.location.href);
    if (allowMailto && parsed.protocol === "mailto:") return true;
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function openImageLightbox(src, alt, caption = "") {
  const dialog = select("#image-lightbox");
  const image = select("#lightbox-image");
  const captionElement = select("#lightbox-caption");
  if (!dialog || !image || !src) return;
  image.src = src;
  image.alt = alt || "Pratinjau gambar";
  captionElement.textContent = caption;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    window.open(src, "_blank", "noopener,noreferrer");
  }
}

function setUpTheme() {
  const themeButton = select(".theme-toggle");
  const root = document.documentElement;
  let savedTheme = "dark";
  try {
    const stored = window.localStorage.getItem("calonceo-theme");
    if (stored === "light" || stored === "dark") savedTheme = stored;
  } catch {
    // Storage may be unavailable; dark mode remains the default.
  }
  root.dataset.theme = savedTheme;
  updateThemeButton(themeButton, savedTheme);

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    updateThemeButton(themeButton, nextTheme);
    try {
      window.localStorage.setItem("calonceo-theme", nextTheme);
    } catch {
      // The selected theme still applies for the current page session.
    }
  });
}

function updateThemeButton(button, theme) {
  if (!button) return;
  const nextLabel = theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap";
  button.setAttribute("aria-label", nextLabel);
  button.setAttribute("title", nextLabel);
}

function setUpMobileNavigation() {
  const toggle = select(".menu-toggle");
  const nav = select("#primary-navigation");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka navigasi");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.setAttribute("aria-label", willOpen ? "Tutup navigasi" : "Buka navigasi");
    nav.classList.toggle("is-open", willOpen);
  });

  selectAll("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 761px)").matches) closeMenu();
  });
}

function setUpPosterPreview() {
  const image = select("#poster-image");
  const fallback = select("#poster-fallback");
  const openButton = select("#poster-open");
  const missingNote = select("#poster-missing-note");
  if (!image || !fallback || !openButton) return;

  // Poster dicoba dalam beberapa ekstensi umum, karena GitHub Pages membedakan huruf besar/kecil
  // dan nama file sering berbeda (.jpg/.jpeg/.png/.webp). Urutan pertama = src di HTML.
  const declaredSrc = image.getAttribute("src") || "";
  const basePath = declaredSrc.replace(/\.[a-z0-9]+$/i, "");
  const candidates = [declaredSrc];
  ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG"].forEach((extension) => {
    const candidate = `${basePath}.${extension}`;
    if (basePath && !candidates.includes(candidate)) candidates.push(candidate);
  });
  let candidateIndex = 0;

  const showPoster = () => {
    image.classList.add("is-loaded");
    fallback.classList.add("is-hidden");
    openButton.disabled = false;
    if (missingNote) {
      missingNote.textContent = "";
      missingNote.hidden = true;
    }
  };

  const showFallback = () => {
    image.classList.remove("is-loaded");
    fallback.classList.remove("is-hidden");
    openButton.disabled = true;
    if (missingNote) {
      missingNote.hidden = false;
      missingNote.textContent = `File poster tidak ditemukan. Unggah ke ${declaredSrc} (perhatikan huruf besar/kecil).`;
    }
  };

  image.addEventListener("load", () => {
    if (!image.naturalWidth || !image.naturalHeight) {
      image.dispatchEvent(new Event("error"));
      return;
    }
    showPoster();
  });

  image.addEventListener("error", () => {
    candidateIndex += 1;
    if (candidateIndex < candidates.length) {
      image.src = candidates[candidateIndex];
      return;
    }
    showFallback();
  });

  openButton.addEventListener("click", () => {
    if (image.complete && image.naturalWidth > 0) {
      openImageLightbox(image.currentSrc || image.src, image.alt, "Bijaklah dalam Bermedsos! — poster asli");
    }
  });

  // Gambar bisa saja sudah selesai (atau gagal) sebelum listener dipasang.
  if (image.complete) {
    if (image.naturalWidth > 0) showPoster();
    else if (image.getAttribute("src")) image.dispatchEvent(new Event("error"));
  }
}

function renderContactLinks() {
  const container = select("#contact-links");
  const hint = select("#contact-config-hint");
  if (!container) return;

  const linkDefinitions = [
    { key: "github", label: "GitHub", url: siteConfig.links.github, external: true },
    { key: "email", label: "Email", url: siteConfig.links.email, external: false },
    { key: "instagram", label: "Instagram", url: siteConfig.links.instagram, external: true },
    { key: "youtube", label: "YouTube", url: siteConfig.links.youtube, external: true }
  ];

  // Email boleh ditulis polos ("nama@domain.com"); otomatis dijadikan tautan mailto:.
  linkDefinitions.forEach((item) => {
    if (item.key === "email" && typeof item.url === "string") {
      const value = item.url.trim();
      if (/^[^\s@:/]+@[^\s@:/]+\.[^\s@:/]+$/.test(value)) item.url = `mailto:${value}`;
    }
  });

  const activeLinks = linkDefinitions.filter((item) => {
    if (!item.url || typeof item.url !== "string") return false;
    return isSafePublicUrl(item.url, item.key === "email");
  });

  container.innerHTML = activeLinks.map((item) => {
    const attributes = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const arrow = item.external ? '<span class="contact-link-arrow" aria-hidden="true">↗</span>' : "";
    return `<a class="contact-link" href="${escapeHTML(item.url)}"${attributes}>${escapeHTML(item.label)} ${arrow}</a>`;
  }).join("");

  if (hint) {
    hint.hidden = activeLinks.length > 0;
  }
}

function photoDetails(item) {
  const details = [];
  if (item.device) details.push(`Perangkat: ${item.device}`);
  if (item.technique) details.push(`Teknik: ${item.technique}`);
  return details.join(" · ");
}

function renderPhotography() {
  const grid = select("#photography-grid");
  const empty = select("#photography-empty");
  const count = select("#photo-count");
  if (!grid || !empty) return;

  const items = photographyItems.filter((item) => item
    && typeof item.title === "string"
    && typeof item.description === "string"
    && isLocalAssetPath(item.src));

  if (count) count.textContent = String(items.length);
  empty.hidden = items.length > 0;
  grid.innerHTML = items.map((item, index) => {
    const src = escapeHTML(item.src);
    const title = escapeHTML(item.title);
    const description = escapeHTML(item.description);
    const category = escapeHTML(item.category || "Photography");
    const alt = escapeHTML(item.alt || item.title);
    const details = escapeHTML(photoDetails(item));
    return `<article class="gallery-card">
      <div class="gallery-media"><button class="gallery-image-button" type="button" data-photo-index="${index}" aria-label="Lihat foto ${title} ukuran penuh"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></button></div>
      <div class="gallery-card-body"><span class="gallery-category">${category}</span><h3>${title}</h3><p>${description}</p>${details ? `<p class="gallery-details">${details}</p>` : ""}</div>
    </article>`;
  }).join("");

  selectAll("[data-photo-index]", grid).forEach((button) => {
    button.addEventListener("click", () => {
      const item = items[Number(button.dataset.photoIndex)];
      if (item) openImageLightbox(item.src, item.alt || item.title, item.title);
    });
  });

  selectAll("img", grid).forEach((image) => {
    image.addEventListener("error", () => {
      const card = image.closest(".gallery-card");
      if (card) card.remove();
      const visibleCards = selectAll(".gallery-card", grid).length;
      if (count) count.textContent = String(visibleCards);
      empty.hidden = visibleCards > 0;
    }, { once: true });
  });
}

function isVideoFile(path) {
  return typeof path === "string" && /\.(mp4|webm|ogg)(\?.*)?$/i.test(path);
}

function renderVideography() {
  const grid = select("#videography-grid");
  const empty = select("#videography-empty");
  const count = select("#video-count");
  if (!grid || !empty) return;

  const items = videographyItems.filter((item) => item
    && typeof item.title === "string"
    && typeof item.description === "string"
    && (isSafePublicUrl(item.videoUrl) || isLocalAssetPath(item.videoUrl)));

  if (count) count.textContent = String(items.length);
  empty.hidden = items.length > 0;
  grid.innerHTML = items.map((item) => {
    const title = escapeHTML(item.title);
    const description = escapeHTML(item.description);
    const category = escapeHTML(item.category || "Videography");
    const thumbnail = isLocalAssetPath(item.thumbnail) ? escapeHTML(item.thumbnail) : "";
    const videoUrl = escapeHTML(item.videoUrl);
    let media = '<div class="gallery-video-fallback"><span aria-hidden="true">▷</span></div>';

    if (isVideoFile(item.videoUrl) && isLocalAssetPath(item.videoUrl)) {
      media = `<video controls preload="metadata"${thumbnail ? ` poster="${thumbnail}"` : ""} aria-label="Video ${title}"><source src="${videoUrl}">Browser ini tidak mendukung pemutaran video.</video>`;
    } else if (thumbnail) {
      media = `<a class="gallery-image-button" href="${videoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Tonton video ${title}"><img src="${thumbnail}" alt="Thumbnail video ${title}" loading="lazy" decoding="async"></a>`;
    }

    const watch = isVideoFile(item.videoUrl) && isLocalAssetPath(item.videoUrl)
      ? ""
      : `<a class="gallery-watch" href="${videoUrl}" target="_blank" rel="noopener noreferrer">Tonton video ↗</a>`;
    return `<article class="gallery-card"><div class="gallery-media">${media}</div><div class="gallery-card-body"><span class="gallery-category">${category}</span><h3>${title}</h3><p>${description}</p>${watch}</div></article>`;
  }).join("");

  selectAll("img", grid).forEach((image) => image.addEventListener("error", () => {
    const media = image.closest(".gallery-media");
    if (media) media.innerHTML = '<div class="gallery-video-fallback"><span aria-hidden="true">▧</span></div>';
  }, { once: true }));
}

function getPortfolioContent() {
  return window.portfolioContent && typeof window.portfolioContent === "object"
    ? window.portfolioContent
    : {};
}

function blogPostsList() {
  const posts = getPortfolioContent().blogPosts;
  if (!Array.isArray(posts)) return [];
  return posts.filter((post) => post
    && typeof post.slug === "string"
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(post.slug)
    && typeof post.title === "string"
    && post.title.trim() !== ""
    && typeof post.summary === "string"
    && post.summary.trim() !== ""
    && Array.isArray(post.content));
}

function formattedBlogDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function isSafeImageSource(value) {
  if (isLocalAssetPath(value)) return true;
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isDirectMediaFile(value, extension) {
  if (typeof value !== "string" || value.trim() === "") return false;
  const raw = value.trim();
  const extensionPattern = new RegExp(`\\.${extension}$`, "i");
  if (isLocalAssetPath(raw)) return extensionPattern.test(raw.split(/[?#]/)[0]);
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" && extensionPattern.test(parsed.pathname);
  } catch {
    return false;
  }
}

function renderBlogList() {
  const grid = select("#blog-grid");
  const empty = select("#blog-empty");
  if (!grid || !empty) return;
  const posts = blogPostsList();
  grid.innerHTML = posts.map((post) => {
    const title = escapeHTML(post.title);
    const summary = escapeHTML(post.summary);
    const slug = escapeHTML(post.slug);
    const category = escapeHTML(post.category || "Catatan");
    const dateText = formattedBlogDate(post.date);
    const cover = isSafeImageSource(post.cover) ? escapeHTML(post.cover.trim()) : "";
    const coverMarkup = cover
      ? `<img class="blog-card-cover" src="${cover}" alt="${escapeHTML(post.coverAlt || `Sampul artikel: ${post.title}`)}" loading="lazy" decoding="async">`
      : '<div class="blog-card-cover-placeholder" aria-hidden="true">✳</div>';
    const dateMarkup = dateText ? `<time class="blog-date" datetime="${escapeHTML(post.date)}">${escapeHTML(dateText)}</time>` : "";
    return `<article class="blog-card">${coverMarkup}<div class="blog-card-body"><div class="blog-card-meta"><span class="blog-category">${category}</span>${dateMarkup}</div><h3>${title}</h3><p class="blog-card-summary">${summary}</p><button class="blog-card-open" type="button" data-blog-open="${slug}">Baca cerita <span aria-hidden="true">↗</span></button></div></article>`;
  }).join("");
  empty.hidden = posts.length > 0;

  selectAll("[data-blog-open]", grid).forEach((button) => {
    button.addEventListener("click", () => openBlogArticle(button.dataset.blogOpen));
  });

  selectAll(".blog-card-cover", grid).forEach((image) => {
    image.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "blog-card-cover-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.textContent = "✳";
      image.replaceWith(placeholder);
    }, { once: true });
  });
}

function renderBlogContentBlocks(blocks) {
  return blocks.map((block) => {
    if (!block || typeof block !== "object") return "";
    const text = escapeHTML(typeof block.text === "string" ? block.text : "");
    if (block.type === "paragraph" && text) return `<p>${text.replace(/\n/g, "<br>")}</p>`;
    if (block.type === "heading" && text) return `<h4>${text}</h4>`;
    if (block.type === "quote" && text) return `<blockquote>${text.replace(/\n/g, "<br>")}</blockquote>`;
    if (block.type === "list" && Array.isArray(block.items)) {
      const items = block.items.filter((item) => typeof item === "string" && item.trim() !== "");
      if (!items.length) return "";
      return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
    }
    return "";
  }).join("");
}

function displayBlogList(scrollToSection = false) {
  const listView = select("#journey-list-view");
  const articleView = select("#blog-article-view");
  if (!listView || !articleView) return;
  listView.hidden = false;
  articleView.hidden = true;
  renderBlogList();
  if (scrollToSection) select("#journey")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

function openBlogArticle(slug, updateHistory = true) {
  const post = blogPostsList().find((item) => item.slug === slug);
  const listView = select("#journey-list-view");
  const articleView = select("#blog-article-view");
  if (!post || !listView || !articleView) {
    displayBlogList(false);
    return;
  }

  if (updateHistory) {
    try {
      window.history.pushState({ blogArticle: post.slug }, "", `${window.location.pathname}${window.location.search}#journey/${encodeURIComponent(post.slug)}`);
    } catch {
      // Some local file:// origins block History API URL changes; the article still opens normally.
    }
  }

  select("#blog-article-category").textContent = post.category || "Catatan";
  select("#blog-article-title").textContent = post.title;
  select("#blog-article-summary").textContent = post.summary;

  const date = select("#blog-article-date");
  const dateText = formattedBlogDate(post.date);
  date.textContent = dateText;
  date.hidden = !dateText;
  if (dateText) date.dateTime = post.date;
  else date.removeAttribute("datetime");

  const cover = select("#blog-article-cover");
  if (isSafeImageSource(post.cover)) {
    cover.src = post.cover.trim();
    cover.alt = typeof post.coverAlt === "string" && post.coverAlt.trim() ? post.coverAlt : `Sampul artikel: ${post.title}`;
    cover.hidden = false;
  } else {
    cover.hidden = true;
    cover.removeAttribute("src");
    cover.alt = "";
  }
  select("#blog-article-content").innerHTML = renderBlogContentBlocks(post.content);
  listView.hidden = true;
  articleView.hidden = false;
  select("#journey")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  articleView.focus({ preventScroll: true });
}

function handleBlogBack() {
  if (/^#journey\//.test(window.location.hash) && window.history.state && window.history.state.blogArticle) {
    window.history.back();
    return;
  }
  try {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#journey`);
  } catch {
    // The button still returns to the article list when History API is unavailable.
  }
  displayBlogList(true);
}

function syncBlogWithHash() {
  const match = window.location.hash.match(/^#journey\/([^/]+)$/);
  if (match) {
    let slug = "";
    try { slug = decodeURIComponent(match[1]); } catch { slug = match[1]; }
    openBlogArticle(slug, false);
    return;
  }
  if (!/^#journey\//.test(window.location.hash)) displayBlogList(false);
}

function setUpBlog() {
  renderBlogList();
  selectAll("[data-blog-back], #blog-back-button").forEach((button) => button.addEventListener("click", handleBlogBack));
  select("#blog-article-cover")?.addEventListener("error", (event) => {
    const image = event.currentTarget;
    image.hidden = true;
    image.removeAttribute("src");
  });
  window.addEventListener("popstate", syncBlogWithHash);
  window.addEventListener("hashchange", syncBlogWithHash);
  if (/^#journey\//.test(window.location.hash)) syncBlogWithHash();
}

function setUpFeaturedVideo() {
  const config = getPortfolioContent().featuredVideo || {};
  const title = select("#featured-video-caption-title");
  const description = select("#featured-video-description");
  const video = select("#featured-video-player");
  const placeholder = select("#featured-video-placeholder");
  const status = select("#featured-video-status");
  if (!title || !description || !video || !placeholder || !status) return;

  title.textContent = typeof config.title === "string" && config.title.trim() ? config.title : "Video Pilihan";
  description.textContent = typeof config.description === "string" && config.description.trim()
    ? config.description
    : "Tambahkan deskripsi video di js/content.js.";
  video.setAttribute("aria-label", `Video pilihan: ${title.textContent}`);

  const failVideo = (message) => {
    video.pause();
    video.hidden = true;
    placeholder.hidden = false;
    status.textContent = message;
  };
  video.addEventListener("error", () => failVideo("Video gagal dimuat. Periksa URL MP4 langsung dan akses publiknya."));

  if (!config.url) {
    status.textContent = "Menunggu URL video.";
    return;
  }
  if (!isDirectMediaFile(config.url, "mp4")) {
    status.textContent = "URL belum valid: gunakan path lokal atau URL HTTPS langsung yang berakhiran .mp4.";
    return;
  }
  if (typeof video.canPlayType !== "function" || !video.canPlayType("video/mp4")) {
    status.textContent = "Browser ini tidak mendukung pemutaran video MP4. Coba browser yang lebih baru.";
    return;
  }

  if (typeof config.poster === "string" && config.poster && isSafeImageSource(config.poster)) {
    video.poster = config.poster;
  }
  const source = document.createElement("source");
  source.src = config.url.trim();
  source.type = "video/mp4";
  // Event error dari <source> tidak naik ke <video>, jadi dipantau langsung di sini.
  source.addEventListener("error", () => failVideo("Video gagal dimuat. Periksa URL MP4 langsung dan akses publiknya."));
  video.append(source);
  video.hidden = false;
  placeholder.hidden = true;
  video.load();
}

function setUpBackgroundMusic() {
  const config = getPortfolioContent().backgroundMusic || {};
  const audio = select("#background-music");
  const toggle = select("#bgm-toggle");
  const label = select("#bgm-toggle-label");
  const title = select("#bgm-track-title");
  const status = select("#bgm-status");
  const volume = select("#bgm-volume");
  if (!audio || !toggle || !label || !title || !status || !volume) return;

  const playLabel = typeof config.playLabel === "string" && config.playLabel.trim() ? config.playLabel : "Putar musik";
  const pauseLabel = typeof config.pauseLabel === "string" && config.pauseLabel.trim() ? config.pauseLabel : "Jeda musik";
  title.textContent = typeof config.title === "string" && config.title.trim() ? config.title : "Musik latar pribadi";
  const initialVolume = Number.isFinite(Number(config.initialVolume)) ? Math.min(1, Math.max(0, Number(config.initialVolume))) : 0.25;
  audio.volume = initialVolume;
  volume.value = String(initialVolume);
  audio.loop = true;
  audio.preload = "none";
  toggle.disabled = true;
  volume.disabled = true;

  const updateControls = (isPlaying) => {
    label.textContent = isPlaying ? pauseLabel : playLabel;
    toggle.setAttribute("aria-label", isPlaying ? `${pauseLabel} latar` : `${playLabel} latar`);
    toggle.setAttribute("aria-pressed", String(isPlaying));
  };
  updateControls(false);

  audio.addEventListener("playing", () => {
    status.textContent = "Musik sedang diputar.";
    updateControls(true);
  });
  audio.addEventListener("pause", () => {
    if (!audio.error) status.textContent = audio.src ? "Musik dijeda." : "URL musik belum diisi.";
    updateControls(false);
  });
  audio.addEventListener("error", () => {
    status.textContent = "Musik gagal dimuat. Periksa URL MP3 dan akses publiknya.";
    toggle.disabled = true;
    volume.disabled = true;
    updateControls(false);
  });

  if (!config.url) {
    status.textContent = "Tambahkan URL MP3 di js/content.js untuk mengaktifkan kontrol.";
    return;
  }
  if (!isDirectMediaFile(config.url, "mp3")) {
    status.textContent = "URL harus berupa path atau URL HTTPS langsung yang berakhiran .mp3.";
    return;
  }

  audio.src = config.url.trim();
  toggle.disabled = false;
  volume.disabled = false;
  status.textContent = "Musik mati. Tekan Putar musik untuk memulai.";

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      status.textContent = "Memuat musik…";
      audio.play().then(() => {
        // The playing event updates the control label and status.
      }).catch(() => {
        status.textContent = "Musik tidak dapat diputar. Periksa URL, koneksi, atau format MP3.";
        updateControls(false);
      });
    } else {
      audio.pause();
    }
  });
  volume.addEventListener("input", () => {
    const nextVolume = Number(volume.value);
    audio.volume = Number.isFinite(nextVolume) ? Math.min(1, Math.max(0, nextVolume)) : initialVolume;
    volume.setAttribute("aria-valuetext", `${Math.round(audio.volume * 100)} persen`);
  });
}

function setUpGalleryTabs() {
  const tabs = selectAll("[data-gallery-tab]");
  const panels = selectAll("[data-gallery-panel]");
  if (!tabs.length || !panels.length) return;

  const activate = (name, moveFocus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.galleryTab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.galleryPanel === name;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.galleryTab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      activate(tabs[nextIndex].dataset.galleryTab, true);
    });
  });
}

function setUpLightbox() {
  const dialog = select("#image-lightbox");
  if (!dialog) return;
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    const image = select("#lightbox-image");
    if (image) image.removeAttribute("src");
  });
}

function setUpRevealAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  const elements = selectAll(".reveal");
  if (!elements.length) return;
  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
  elements.forEach((element) => observer.observe(element));
}

function setUpCurrentYear() {
  const year = select("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initializePortfolio() {
  setUpTheme();
  setUpMobileNavigation();
  setUpPosterPreview();
  renderContactLinks();
  setUpBlog();
  setUpFeaturedVideo();
  setUpBackgroundMusic();
  renderPhotography();
  renderVideography();
  setUpGalleryTabs();
  setUpLightbox();
  setUpCurrentYear();
  setUpRevealAnimations();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
} else {
  initializePortfolio();
}
