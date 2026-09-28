// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const listings = Array.isArray(window.afterdarkDemoProfiles)
    ? window.afterdarkDemoProfiles
    : [];

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const state = {
    keyword: "",
    city: "",
    category: "",
    sort: "featured",
    page: 1,
    pageSize: 24
  };

  // --------------------------------------------------
  // DOM ELEMENTS
  // --------------------------------------------------

  const ageGate = document.getElementById("ageGate");
  const enterWebsite = document.getElementById("enterWebsite");
  const leaveWebsite = document.getElementById("leaveWebsite");

  const searchInput = document.getElementById("searchInput");
  const citySelect = document.getElementById("citySelect");
  const searchButton = document.getElementById("searchButton");

  const listingGrid = document.getElementById("listingGrid");
  const emptyState = document.getElementById("emptyState");
  const clearFiltersButton = document.getElementById("clearFilters");

  const sortSelect = document.getElementById("sortSelect");
  const activeFilters = document.getElementById("activeFilters");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mainNavigation = document.getElementById("mainNavigation");

  const postListingButton = document.getElementById("postListingButton");

  const toast = document.getElementById("toast");

  // --------------------------------------------------
  // AGE GATE
  // --------------------------------------------------

  function checkAgeGate() {
    const ageVerified = localStorage.getItem("afterdarkAgeVerified");

    if (ageVerified === "true") {
      if (ageGate) {
        ageGate.style.display = "none";
      }
    } else {
      if (ageGate) {
        ageGate.style.display = "flex";
      }
    }
  }

  if (enterWebsite) {
    enterWebsite.addEventListener("click", () => {
      localStorage.setItem("afterdarkAgeVerified", "true");

      if (ageGate) {
        ageGate.style.display = "none";
      }
    });
  }

  if (leaveWebsite) {
    leaveWebsite.addEventListener("click", () => {
      window.location.href = "https://www.google.com/";
    });
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getFilteredListings() {
    let result = [...listings];

    // Keyword
    if (state.keyword) {
      const keyword = state.keyword.toLowerCase();

      result = result.filter((profile) => {
        return (
          profile.displayName.toLowerCase().includes(keyword) ||
          profile.username.toLowerCase().includes(keyword) ||
          profile.city.toLowerCase().includes(keyword) ||
          profile.category.toLowerCase().includes(keyword) ||
          profile.description.toLowerCase().includes(keyword)
        );
      });
    }

    // City
    if (state.city) {
      result = result.filter(
        (profile) => profile.city === state.city
      );
    }

    // Category
    if (state.category) {
      result = result.filter(
        (profile) => profile.category === state.category
      );
    }

    // Sorting
    switch (state.sort) {
      case "featured":
        result.sort((a, b) => {
          return Number(b.featured) - Number(a.featured);
        });
        break;

      case "newest":
        result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;

      case "name":
        result.sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );
        break;

      default:
        break;
    }

    return result;
  }

  // --------------------------------------------------
  // PHOTO FALLBACK
  // --------------------------------------------------

  function getProfileImage(profile) {
    if (
      profile.photos &&
      profile.photos.length > 0 &&
      profile.photos[0].src
    ) {
      return profile.photos[0].src;
    }

    return "assets/images/profiles/placeholder.jpg";
  }

  // --------------------------------------------------
  // RENDER LISTINGS
  // --------------------------------------------------

  function renderListings() {
    if (!listingGrid) return;

    const filtered = getFilteredListings();

    const totalPages = Math.max(
      1,
      Math.ceil(filtered.length / state.pageSize)
    );

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;

    const visibleListings = filtered.slice(start, end);

    listingGrid.innerHTML = "";

    if (visibleListings.length === 0) {
      if (emptyState) {
        emptyState.style.display = "block";
      }

      renderPagination(0);
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    visibleListings.forEach((profile) => {
      const card = document.createElement("article");

      card.className = "listing-card";

      const image = getProfileImage(profile);

      card.innerHTML = `
        <div class="listing-photo">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(profile.displayName)}"
            loading="lazy"
            onerror="this.src='assets/images/profiles/placeholder.jpg'"
          >

          ${
            profile.featured
              ? `<span class="featured-badge">Featured</span>`
              : ""
          }

          ${
            profile.online
              ? `<span class="online-badge">Online</span>`
              : ""
          }
        </div>

        <div class="listing-body">

          <div class="listing-title-row">
            <h3>${escapeHtml(profile.displayName)}</h3>

            ${
              profile.verified
                ? `<span class="verified-badge" title="Verified">✓</span>`
                : ""
            }
          </div>

          <p class="listing-location">
            ${escapeHtml(profile.city)}, ${escapeHtml(profile.state)}
          </p>

          <p class="listing-category">
            ${escapeHtml(profile.category)}
          </p>

          <p class="listing-description">
            ${escapeHtml(profile.description)}
          </p>

          <div class="listing-actions">

            <button
              class="btn btn-primary view-profile"
              data-profile-id="${escapeHtml(profile.id)}"
            >
              View Profile
            </button>

            <button
              class="btn btn-secondary contact-profile"
              data-profile-id="${escapeHtml(profile.id)}"
            >
              Contact
            </button>

          </div>

        </div>
      `;

      listingGrid.appendChild(card);
    });

    renderPagination(filtered.length);
    attachListingEvents();
  }

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  function renderPagination(totalItems) {
    let pagination = document.getElementById("pagination");

    if (!pagination) {
      pagination = document.createElement("div");
      pagination.id = "pagination";

      if (listingGrid && listingGrid.parentNode) {
        listingGrid.parentNode.appendChild(pagination);
      }
    }

    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / state.pageSize);

    if (totalPages <= 1) {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.className = "pagination-wrapper";

    const previousButton = document.createElement("button");

    previousButton.className = "pagination-button";
    previousButton.textContent = "Previous";
    previousButton.disabled = state.page === 1;

    previousButton.addEventListener("click", () => {
      if (state.page > 1) {
        state.page--;
        renderListings();

        window.scrollTo({
          top: listingGrid.offsetTop - 100,
          behavior: "smooth"
        });
      }
    });

    wrapper.appendChild(previousButton);

    const maxButtons = 7;

    let startPage = Math.max(
      1,
      state.page - Math.floor(maxButtons / 2)
    );

    let endPage = Math.min(
      totalPages,
      startPage + maxButtons - 1
    );

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(
        1,
        endPage - maxButtons + 1
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      const pageButton = document.createElement("button");

      pageButton.className = "pagination-button";

      if (page === state.page) {
        pageButton.classList.add("active");
      }

      pageButton.textContent = page;

      pageButton.addEventListener("click", () => {
        state.page = page;

        renderListings();

        window.scrollTo({
          top: listingGrid.offsetTop - 100,
          behavior: "smooth"
        });
      });

      wrapper.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");

    nextButton.className = "pagination-button";
    nextButton.textContent = "Next";
    nextButton.disabled = state.page === totalPages;

    nextButton.addEventListener("click", () => {
      if (state.page < totalPages) {
        state.page++;
        renderListings();

        window.scrollTo({
          top: listingGrid.offsetTop - 100,
          behavior: "smooth"
        });
      }
    });

    wrapper.appendChild(nextButton);

    pagination.appendChild(wrapper);
  }

  // --------------------------------------------------
  // LISTING EVENTS
  // --------------------------------------------------

  function attachListingEvents() {
    document.querySelectorAll(".view-profile").forEach((button) => {
      button.addEventListener("click", () => {
        const profileId = button.dataset.profileId;

        showToast(
          `Demo profile selected: ${profileId}`
        );
      });
    });

    document.querySelectorAll(".contact-profile").forEach((button) => {
      button.addEventListener("click", () => {
        const profileId = button.dataset.profileId;

        showToast(
          `Demo contact action: ${profileId}`
        );
      });
    });
  }

  // --------------------------------------------------
  // ACTIVE FILTERS
  // --------------------------------------------------

  function renderActiveFilters() {
    if (!activeFilters) return;

    activeFilters.innerHTML = "";

    if (state.keyword) {
      addFilterTag(
        `Search: ${state.keyword}`,
        () => {
          state.keyword = "";

          if (searchInput) {
            searchInput.value = "";
          }

          state.page = 1;

          renderActiveFilters();
          renderListings();
        }
      );
    }

    if (state.city) {
      addFilterTag(
        `City: ${state.city}`,
        () => {
          state.city = "";

          if (citySelect) {
            citySelect.value = "";
          }

          state.page = 1;

          renderActiveFilters();
          renderListings();
        }
      );
    }

    if (state.category) {
      addFilterTag(
        `Category: ${state.category}`,
        () => {
          state.category = "";

          state.page = 1;

          renderActiveFilters();
          renderListings();
        }
      );
    }
  }

  function addFilterTag(label, removeFunction) {
    const tag = document.createElement("button");

    tag.className = "filter-tag";
    tag.type = "button";
    tag.textContent = `${label} ×`;

    tag.addEventListener("click", removeFunction);

    activeFilters.appendChild(tag);
  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  function performSearch() {
    state.keyword = searchInput
      ? searchInput.value.trim()
      : "";

    state.city = citySelect
      ? citySelect.value
      : "";

    state.page = 1;

    renderActiveFilters();
    renderListings();
  }

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      performSearch
    );
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        performSearch();
      }
    });
  }

  if (citySelect) {
    citySelect.addEventListener("change", () => {
      state.city = citySelect.value;
      state.page = 1;

      renderActiveFilters();
      renderListings();
    });
  }

  // --------------------------------------------------
  // CATEGORY FILTER
  // --------------------------------------------------

  document.querySelectorAll("[data-category]").forEach((element) => {
    element.addEventListener("click", () => {
      const category = element.dataset.category;

      state.category =
        state.category === category
          ? ""
          : category;

      state.page = 1;

      renderActiveFilters();
      renderListings();
    });
  });

  // --------------------------------------------------
  // CITY FILTER
  // --------------------------------------------------

  document.querySelectorAll("[data-city]").forEach((element) => {
    element.addEventListener("click", () => {
      const city = element.dataset.city;

      state.city =
        state.city === city
          ? ""
          : city;

      if (citySelect) {
        citySelect.value = state.city;
      }

      state.page = 1;

      renderActiveFilters();
      renderListings();
    });
  });

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      state.page = 1;

      renderListings();
    });
  }

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      state.keyword = "";
      state.city = "";
      state.category = "";
      state.page = 1;

      if (searchInput) {
        searchInput.value = "";
      }

      if (citySelect) {
        citySelect.value = "";
      }

      renderActiveFilters();
      renderListings();
    });
  }

  // --------------------------------------------------
  // POST LISTING
  // --------------------------------------------------

  if (postListingButton) {
    postListingButton.addEventListener("click", () => {
      showToast(
        "Demo mode: listing submission will be connected to the backend later."
      );
    });
  }

  // --------------------------------------------------
  // MOBILE MENU
  // --------------------------------------------------

  if (mobileMenuButton && mainNavigation) {
    mobileMenuButton.addEventListener("click", () => {
      mainNavigation.classList.toggle("mobile-open");
    });
  }

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // --------------------------------------------------
  // INITIALIZE
  // --------------------------------------------------

  checkAgeGate();
  renderActiveFilters();
  renderListings();

  console.log(
    `AfterDark AU demo loaded: ${listings.length} profiles`
  );
});
