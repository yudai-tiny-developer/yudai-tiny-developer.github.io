/**
 * Simple and Tiny Utilities - Interactive Showcase Script
 * Handles real-time search, category filtering, accessible modals, and deep-linking.
 */
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchInput = document.getElementById("search-input");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const toolCards = document.querySelectorAll(".tool-card");
  const toolsGrid = document.querySelector(".tools-grid");
  const noResults = document.getElementById("no-results");
  const mainContent = document.querySelector(".main-content");

  // Modal Elements
  const modal = document.getElementById("tool-modal");
  const modalOverlay = modal.querySelector(".modal-overlay");
  const modalCloseBtn = modal.querySelector(".modal-close");
  const modalIcon = document.getElementById("modal-icon");
  const modalTitle = document.getElementById("modal-title");
  const modalBadges = document.getElementById("modal-badges");
  const modalGallery = document.getElementById("modal-gallery");
  const modalDesc = document.getElementById("modal-desc");
  const modalChrome = document.getElementById("modal-chrome");
  const modalFirefox = document.getElementById("modal-firefox");
  const modalWebsite = document.getElementById("modal-website");
  const modalGithub = document.getElementById("modal-github");
  const modalShareBtn = document.getElementById("modal-share-btn");
  const toast = document.getElementById("toast");

  let activeCategory = "all";
  let activeSearchQuery = "";
  let currentActiveCard = null;

  /**
   * Filter cards based on both active category and current search keyword.
   * Dynamically ensures minimum height to prevent abrupt page shrink and scroll jumping.
   */
  function applyFilters() {
    // Preserve minimum height so the page doesn't collapse below the current scroll offset
    if (mainContent) {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const mainTop = mainContent.getBoundingClientRect().top + currentScrollY;
      // Guarantee document has at least enough height to prevent browser upward scroll snap
      const neededHeight = Math.max(500, currentScrollY + window.innerHeight - mainTop);
      mainContent.style.minHeight = `${neededHeight}px`;
    }

    let visibleCount = 0;
    const query = activeSearchQuery.toLowerCase().trim();

    toolCards.forEach((card) => {
      const cardCategory = card.dataset.category || "";
      const cardTitle = (card.dataset.title || "").toLowerCase();
      const cardDesc = (card.dataset.desc || "").toLowerCase();
      const cardTags = (card.dataset.tags || "").toLowerCase();

      const matchesCategory =
        activeCategory === "all" || cardCategory.includes(activeCategory);

      const matchesQuery =
        !query ||
        cardTitle.includes(query) ||
        cardDesc.includes(query) ||
        cardTags.includes(query);

      if (matchesCategory && matchesQuery) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (visibleCount === 0) {
      if (toolsGrid) toolsGrid.classList.add("hidden");
      noResults.classList.remove("hidden");
    } else {
      if (toolsGrid) toolsGrid.classList.remove("hidden");
      noResults.classList.add("hidden");
    }
  }

  // Search Input Event
  searchInput.addEventListener("input", (e) => {
    activeSearchQuery = e.target.value;
    applyFilters();
  });

  // Filter Tabs Event
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.dataset.filter;
      applyFilters();
    });
  });

  /**
   * Show Toast Notification.
   */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /**
   * Open Modal with tool details.
   */
  function openModal(card) {
    currentActiveCard = card;
    const toolId = card.id;

    // Update metadata & texts
    modalTitle.textContent = card.dataset.title;
    modalIcon.src = card.dataset.icon;
    modalIcon.alt = `${card.dataset.title} Icon`;

    // Format description (preserve line breaks)
    modalDesc.textContent = card.dataset.desc.replace(/\\n/g, "\n");

    // Clear and build badges
    modalBadges.innerHTML = "";
    if (card.dataset.chromeStore) {
      const b = createBadge("logo/chrome.png", "Chrome Web Store");
      modalBadges.appendChild(b);
    }
    if (card.dataset.firefoxAddons) {
      const b = createBadge("logo/firefox.png", "Firefox Add-on");
      modalBadges.appendChild(b);
    }
    if (card.dataset.website) {
      const b = createBadge("logo/website.png", "Web Application");
      modalBadges.appendChild(b);
    }
    if (card.dataset.github) {
      const b = createBadge("logo/github.png", "Open Source");
      modalBadges.appendChild(b);
    }

    // Set CTA link buttons
    updateCtaButton(modalChrome, card.dataset.chromeStore);
    updateCtaButton(modalFirefox, card.dataset.firefoxAddons);
    updateCtaButton(modalWebsite, card.dataset.website);
    updateCtaButton(modalGithub, card.dataset.github);

    // Populate Screenshots Gallery
    modalGallery.innerHTML = "";
    const images = (card.dataset.images || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (images.length > 0) {
      modalGallery.style.display = "flex";
      images.forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `${card.dataset.title} Screenshot`;
        img.loading = "lazy";
        img.decoding = "async";
        modalGallery.appendChild(img);
      });
    } else {
      modalGallery.style.display = "none";
    }

    // Update URL hash for deep-linking
    if (history.pushState) {
      history.pushState(null, "", `#${toolId}`);
    } else {
      location.hash = `#${toolId}`;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();
  }

  function createBadge(iconSrc, label) {
    const pill = document.createElement("span");
    pill.className = "platform-pill";
    const img = document.createElement("img");
    img.src = iconSrc;
    img.alt = "";
    img.className = "platform-icon";
    pill.appendChild(img);
    pill.appendChild(document.createTextNode(label));
    return pill;
  }

  function updateCtaButton(el, url) {
    if (url && url !== "undefined" && url !== "") {
      el.href = url;
      el.style.display = "inline-flex";
    } else {
      el.style.display = "none";
    }
  }

  /**
   * Close Modal.
   */
  function closeModal() {
    if (modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";

    // Clear hash cleanly without jumping
    if (location.hash) {
      if (history.pushState) {
        history.pushState(null, "", window.location.pathname);
      } else {
        location.hash = "";
      }
    }

    if (currentActiveCard) {
      currentActiveCard.focus();
    }
  }

  // Share / Copy Link Event
  modalShareBtn.addEventListener("click", async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Link copied to clipboard!");
      } else {
        // Fallback
        const dummy = document.createElement("input");
        dummy.value = shareUrl;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        showToast("Link copied to clipboard!");
      }
    } catch (err) {
      showToast("Failed to copy link.");
    }
  });

  // Attach card click & keyboard events
  toolCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // If clicking directly on an anchor or button inside card, don't trigger modal
      if (e.target.closest("a") || e.target.closest("button")) {
        return;
      }
      openModal(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!e.target.closest("a") && !e.target.closest("button")) {
          e.preventDefault();
          openModal(card);
        }
      }
    });

    // Details button inside card
    const detailBtn = card.querySelector(".btn-details");
    if (detailBtn) {
      detailBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(card);
      });
    }
  });

  // Close modal events
  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Handle initial URL hash for deep-linking (e.g. #subscription-feed-filter)
  function handleHashNavigation() {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const targetCard = document.getElementById(hash);
      if (targetCard) {
        setTimeout(() => {
          openModal(targetCard);
        }, 100);
      }
    } else {
      closeModal();
    }
  }

  window.addEventListener("hashchange", handleHashNavigation);
  handleHashNavigation();

  // Initial filter application to ensure visibility states are synchronized
  applyFilters();
});
