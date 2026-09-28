document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // AGE GATE
  // =========================

  const ageGate = document.getElementById("ageGate");
  const enterWebsite = document.getElementById("enterWebsite");
  const leaveWebsite = document.getElementById("leaveWebsite");

  function hideAgeGate() {
    if (ageGate) {
      ageGate.style.display = "none";
    }
  }

  function showAgeGate() {
    if (ageGate) {
      ageGate.style.display = "flex";
    }
  }

  // Check previous verification
  try {
    if (localStorage.getItem("afterdarkAgeVerified") === "true") {
      hideAgeGate();
    } else {
      showAgeGate();
    }
  } catch (error) {
    showAgeGate();
  }

  // Enter website
  if (enterWebsite) {
    enterWebsite.addEventListener("click", function () {

      try {
        localStorage.setItem("afterdarkAgeVerified", "true");
      } catch (error) {
        // Continue even if localStorage is unavailable
      }

      hideAgeGate();
    });
  }

  // Leave website
  if (leaveWebsite) {
    leaveWebsite.addEventListener("click", function () {
      window.location.href = "https://www.google.com/";
    });
  }


  // =========================
  // DEMO DATA
  // =========================

  const profiles = Array.isArray(window.afterdarkDemoProfiles)
    ? window.afterdarkDemoProfiles
    : [];

  console.log("Profiles loaded:", profiles.length);


  // =========================
  // ELEMENTS
  // =========================

  const listingGrid = document.getElementById("listingGrid");
  const emptyState = document.getElementById("emptyState");
  const pagination = document.getElementById("pagination");

  const searchInput = document.getElementById("searchInput");
  const citySelect = document.getElementById("citySelect");
  const searchButton = document.getElementById("searchButton");
  const sortSelect = document.getElementById("sortSelect");

  const activeFilters = document.getElementById("activeFilters");
  const clearFilters = document.getElementById("clearFilters");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mainNavigation = document.getElementById("mainNavigation");

  const postListingButton =
    document.getElementById("postListingButton");

  const categoryButtons =
    document.querySelectorAll("[data-category]");

  const cityButtons =
    document.querySelectorAll("[data-city]");


  // =========================
  // STATE
  // =========================

  const state = {
    keyword: "",
    city: "",
    category: "",
    sort: "featured",
    page: 1,
    pageSize: 24
  };


  // =========================
  // HELPERS
  // =========================

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function getProfileImage(profile) {

    if (
      profile &&
      Array.isArray(profile.photos) &&
      profile.photos.length > 0
    ) {
      return profile.photos[0];
    }

    return "assets/images/profiles/placeholder.jpg";
  }


  function getFilteredProfiles() {

    let result = profiles.filter(function (profile) {

      const keyword = state.keyword.toLowerCase().trim();

      const matchesKeyword =
        !keyword ||
        String(profile.displayName || "")
          .toLowerCase()
          .includes(keyword) ||
        String(profile.username || "")
          .toLowerCase()
          .includes(keyword) ||
        String(profile.city || "")
          .toLowerCase()
          .includes(keyword) ||
        String(profile.category || "")
          .toLowerCase()
          .includes(keyword);

      const matchesCity =
        !state.city ||
        profile.city === state.city;

      const matchesCategory =
        !state.category ||
        profile.category === state.category;

      return (
        matchesKeyword &&
        matchesCity &&
        matchesCategory
      );
    });


    // Sorting
    if (state.sort === "name") {

      result.sort(function (a, b) {
        return String(a.displayName)
          .localeCompare(String(b.displayName));
      });

    } else if (state.sort === "newest") {

      result.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    } else {

      result.sort(function (a, b) {

        if (Boolean(b.featured) !== Boolean(a.featured)) {
          return b.featured ? 1 : -1;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return result;
  }


  // =========================
  // RENDER LISTINGS
  // =========================

  function renderListings() {

    if (!listingGrid) return;

    const result = getFilteredProfiles();

    const totalPages = Math.max(
      1,
      Math.ceil(result.length / state.pageSize)
    );

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start =
      (state.page - 1) * state.pageSize;

    const pageItems =
      result.slice(
        start,
        start + state.pageSize
      );


    listingGrid.innerHTML = "";


    if (pageItems.length === 0) {

      if (emptyState) {
        emptyState.hidden = false;
      }

      if (pagination) {
        pagination.innerHTML = "";
      }

      return;
    }


    if (emptyState) {
      emptyState.hidden = true;
    }


    pageItems.forEach(function (profile) {

      const card =
        document.createElement("article");

      card.className = "listing-card";


      const image =
        escapeHtml(getProfileImage(profile));

      const name =
        escapeHtml(profile.displayName);

      const city =
        escapeHtml(profile.city);

      const stateName =
        escapeHtml(profile.state);

      const category =
        escapeHtml(profile.category);

      const description =
        escapeHtml(profile.description);


      card.innerHTML = `
        <div class="listing-photo">

          <img
            src="${image}"
            alt="${name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='assets/images/profiles/placeholder.jpg';"
          >

          ${
            profile.featured
              ? `<span class="featured-badge">Featured</span>`
              : ""
          }

          ${
            profile.online
              ? `<span class="online-badge">
                   <span></span> Online
                 </span>`
              : ""
          }

        </div>

        <div class="listing-body">

          <div class="listing-title-row">

            <h3 class="listing-title">
              ${name}
            </h3>

            ${
              profile.verified
                ? `<span class="verified-badge">
                     ✓ Verified
                   </span>`
                : ""
            }

          </div>

          <div class="listing-location">
            ${city}, ${stateName}
          </div>

          <div class="listing-category">
            ${category}
          </div>

          <p class="listing-description">
            ${description}
          </p>

          <div class="listing-actions">

            <button
              type="button"
              class="btn btn-primary view-profile-button"
              data-profile-id="${escapeHtml(profile.id)}"
            >
              View Profile
            </button>

            <button
              type="button"
              class="btn btn-secondary contact-button"
              data-profile-id="${escapeHtml(profile.id)}"
            >
              Contact
            </button>

          </div>

        </div>
      `;


      listingGrid.appendChild(card);
    });


    // View profile buttons
    document
      .querySelectorAll(".view-profile-button")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          const id =
            button.getAttribute("data-profile-id");

          window.location.href =
            "profile.html?id=" +
            encodeURIComponent(id);
        });
      });


    // Contact buttons
    document
      .querySelectorAll(".contact-button")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          showToast(
            "Contact functionality will be connected later."
          );
        });
      });


    renderPagination(totalPages);
  }


  // =========================
  // PAGINATION
  // =========================

  function renderPagination(totalPages) {

    if (!pagination) return;

    pagination.innerHTML = "";

    if (totalPages <= 1) return;


    const wrapper =
      document.createElement("div");

    wrapper.className =
      "pagination";


    function addButton(
      text,
      page,
      disabled
    ) {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "pagination-button";

      button.textContent = text;

      button.disabled = disabled;

      button.addEventListener(
        "click",
        function () {

          state.page = page;

          renderListings();

          window.scrollTo({
            top: document.getElementById("listings")
              ? document.getElementById("listings").offsetTop - 80
              : 0,
            behavior: "smooth"
          });
        }
      );

      wrapper.appendChild(button);
    }


    addButton(
      "Previous",
      state.page - 1,
      state.page === 1
    );


    const start =
      Math.max(1, state.page - 2);

    const end =
      Math.min(totalPages, state.page + 2);


    for (
      let page = start;
      page <= end;
      page++
    ) {

      addButton(
        String(page),
        page,
        page === state.page
      );
    }


    addButton(
      "Next",
      state.page + 1,
      state.page === totalPages
    );


    pagination.appendChild(wrapper);
  }


  // =========================
  // ACTIVE FILTERS
  // =========================

  function renderActiveFilters() {

    if (!activeFilters) return;

    activeFilters.innerHTML = "";


    if (state.keyword) {

      addFilter(
        "Search: " + state.keyword,
        function () {
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

      addFilter(
        "City: " + state.city,
        function () {

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

      addFilter(
        "Category: " + state.category,
        function () {

          state.category = "";

          state.page = 1;

          renderActiveFilters();
          renderListings();
        }
      );
    }
  }


  function addFilter(label, removeFunction) {

    const tag =
      document.createElement("button");

    tag.type = "button";

    tag.className = "filter-tag";

    tag.textContent = label + " ×";

    tag.addEventListener(
      "click",
      removeFunction
    );

    activeFilters.appendChild(tag);
  }


  // =========================
  // SEARCH
  // =========================

  function performSearch() {

    state.keyword =
      searchInput
        ? searchInput.value.trim()
        : "";

    state.city =
      citySelect
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

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {
          performSearch();
        }
      }
    );
  }


  if (citySelect) {

    citySelect.addEventListener(
      "change",
      function () {

        state.city =
          citySelect.value;

        state.page = 1;

        renderActiveFilters();
        renderListings();
      }
    );
  }


  // =========================
  // CATEGORY BUTTONS
  // =========================

  categoryButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          state.category =
            button.getAttribute("data-category") || "";

          state.page = 1;

          renderActiveFilters();
          renderListings();
        }
      );
    }
  );


  // =========================
  // CITY BUTTONS
  // =========================

  cityButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const city =
            button.getAttribute("data-city");

          state.city = city;

          if (citySelect) {
            citySelect.value = city;
          }

          state.page = 1;

          renderActiveFilters();
          renderListings();

          const listings =
            document.getElementById("listings");

          if (listings) {
            listings.scrollIntoView({
              behavior: "smooth"
            });
          }
        }
      );
    }
  );


  // =========================
  // SORT
  // =========================

  if (sortSelect) {

    sortSelect.addEventListener(
      "change",
      function () {

        state.sort =
          sortSelect.value;

        state.page = 1;

        renderListings();
      }
    );
  }


  // =========================
  // CLEAR FILTERS
  // =========================

  if (clearFilters) {

    clearFilters.addEventListener(
      "click",
      function () {

        state.keyword = "";
        state.city = "";
        state.category = "";
        state.sort = "featured";
        state.page = 1;

        if (searchInput) {
          searchInput.value = "";
        }

        if (citySelect) {
          citySelect.value = "";
        }

        if (sortSelect) {
          sortSelect.value = "featured";
        }

        renderActiveFilters();
        renderListings();
      }
    );
  }


  // =========================
  // MOBILE MENU
  // =========================

  if (
    mobileMenuButton &&
    mainNavigation
  ) {

    mobileMenuButton.addEventListener(
      "click",
      function () {

        const isOpen =
          mainNavigation.classList.toggle("menu-open");

        mobileMenuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );
  }


  // =========================
  // POST LISTING
  // =========================

  if (postListingButton) {

    postListingButton.addEventListener(
      "click",
      function () {

        showToast(
          "Post Listing functionality will be connected later."
        );
      }
    );
  }


  // =========================
  // TOAST
  // =========================

  function showToast(message) {

    const toast =
      document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(
      function () {
        toast.classList.remove("show");
      },
      3000
    );
  }


  // =========================
  // INITIAL RENDER
  // =========================

  renderActiveFilters();
  renderListings();

});
