document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================
     AGE GATE
  ========================================= */

  const ageGate = document.getElementById("ageGate");
  const enterButton = document.getElementById("enterWebsite");
  const leaveButton = document.getElementById("leaveWebsite");

  function hideAgeGate() {
    if (!ageGate) return;

    ageGate.classList.add("hidden");
    ageGate.setAttribute("aria-hidden", "true");
  }

  function showAgeGate() {
    if (!ageGate) return;

    ageGate.classList.remove("hidden");
    ageGate.removeAttribute("aria-hidden");
  }

  try {
    if (
      localStorage.getItem("afterdarkAgeVerified") === "true"
    ) {
      hideAgeGate();
    } else {
      showAgeGate();
    }
  } catch (error) {
    showAgeGate();
  }

  enterButton?.addEventListener("click", () => {
    try {
      localStorage.setItem(
        "afterdarkAgeVerified",
        "true"
      );
    } catch (error) {
      // Continue even if storage is unavailable.
    }

    hideAgeGate();
  });

  leaveButton?.addEventListener("click", () => {
    window.location.href = "https://www.google.com/";
  });


  /* =========================================
     DATA
  ========================================= */

  const profiles = Array.isArray(
    window.afterdarkDemoProfiles
  )
    ? window.afterdarkDemoProfiles
    : [];


  /* =========================================
     STATE
  ========================================= */

  const state = {
    keyword: "",
    city: "",
    category: "",
    sort: "featured",
    page: 1,
    pageSize: 24
  };


  /* =========================================
     ELEMENTS
  ========================================= */

  const grid =
    document.getElementById("listingGrid");

  const empty =
    document.getElementById("emptyState");

  const pagination =
    document.getElementById("pagination");

  const searchInput =
    document.getElementById("searchInput");

  const citySelect =
    document.getElementById("citySelect");

  const sortSelect =
    document.getElementById("sortSelect");

  const activeFilters =
    document.getElementById("activeFilters");

  const listingsSection =
    document.getElementById("listings");


  /* =========================================
     SECURITY HELPER
  ========================================= */

  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]
    );
  }


  /* =========================================
     IMAGE
  ========================================= */

  function getProfileImage(profile) {
    return (
      profile.photos?.[0] ||
      "assets/images/profiles/placeholder.svg"
    );
  }


  /* =========================================
     FILTER PROFILES
  ========================================= */

  function getFilteredProfiles() {
    const keyword =
      state.keyword.toLowerCase();

    let list = profiles.filter(profile => {

      const searchableText = [
        profile.displayName,
        profile.username,
        profile.city,
        profile.state,
        profile.category
      ]
        .join(" ")
        .toLowerCase();

      const matchesKeyword =
        !keyword ||
        searchableText.includes(keyword);

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


    /* SORT */

    if (state.sort === "name") {

      list.sort((a, b) =>
        a.displayName.localeCompare(
          b.displayName
        )
      );

    } else if (state.sort === "newest") {

      list.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    } else {

      list.sort(
        (a, b) =>
          Number(b.featured) -
            Number(a.featured) ||
          new Date(b.createdAt) -
            new Date(a.createdAt)
      );

    }

    return list;
  }


  /* =========================================
     RENDER PROFILES
  ========================================= */

  function renderProfiles() {

    if (!grid) return;

    const list =
      getFilteredProfiles();

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          list.length /
          state.pageSize
        )
      );

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start =
      (state.page - 1) *
      state.pageSize;

    const items =
      list.slice(
        start,
        start + state.pageSize
      );

    grid.innerHTML = "";

    if (empty) {
      empty.hidden =
        items.length > 0;
    }


    /* NO RESULTS */

    if (items.length === 0) {
      renderPagination(0);
      renderActiveFilters();
      return;
    }


    /* PROFILE CARDS */

    items.forEach(profile => {

      const card =
        document.createElement("article");

      card.className = "card";

      const image =
        getProfileImage(profile);

      card.innerHTML = `
        <div class="photo">

          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(profile.displayName)}"
            loading="lazy"
          >

          ${
            profile.featured
              ? `
                <span class="badge featured">
                  Featured
                </span>
              `
              : ""
          }

          ${
            profile.online
              ? `
                <span class="badge online">
                  <i></i>
                  Online
                </span>
              `
              : ""
          }

        </div>

        <div class="card-body">

          <div class="title-row">

            <h3>
              ${escapeHtml(
                profile.displayName
              )}
            </h3>

            ${
              profile.verified
                ? `
                  <span class="verified">
                    ✓ Verified
                  </span>
                `
                : ""
            }

          </div>

          <div class="meta">
            ${escapeHtml(profile.city)},
            ${escapeHtml(profile.state)}
          </div>

          <div class="category">
            ${escapeHtml(profile.category)}
          </div>

          <p>
            ${escapeHtml(
              profile.description
            )}
          </p>

          <button
            class="btn primary full"
            type="button"
            data-profile="${escapeHtml(profile.id)}"
          >
            View Profile
          </button>

        </div>
      `;

      const imageElement =
        card.querySelector("img");

      imageElement?.addEventListener(
        "error",
        () => {
          imageElement.src =
            "assets/images/profiles/placeholder.svg";
        },
        { once: true }
      );

      grid.appendChild(card);
    });


    /* PROFILE BUTTONS */

    grid
      .querySelectorAll("[data-profile]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const profileId =
              button.dataset.profile;

            if (!profileId) return;

            window.location.href =
              `profile.html?id=${encodeURIComponent(
                profileId
              )}`;
          }
        );

      });


    renderPagination(totalPages);
    renderActiveFilters();
  }


  /* =========================================
     PAGINATION
  ========================================= */

  function renderPagination(totalPages) {

    if (!pagination) return;

    pagination.innerHTML = "";

    if (totalPages <= 1) return;


    function addButton(
      label,
      page,
      disabled = false
    ) {

      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "page-btn";
      button.textContent = label;
      button.disabled = disabled;

      button.addEventListener(
        "click",
        () => {

          state.page = page;

          renderProfiles();

          listingsSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

      pagination.appendChild(button);
    }


    addButton(
      "Previous",
      state.page - 1,
      state.page === 1
    );


    const start =
      Math.max(
        1,
        state.page - 2
      );

    const end =
      Math.min(
        totalPages,
        state.page + 2
      );


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
  }


  /* =========================================
     ACTIVE FILTERS
  ========================================= */

  function renderActiveFilters() {

    if (!activeFilters) return;

    activeFilters.innerHTML = "";


    function addFilter(
      text,
      removeFunction
    ) {

      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "filter";
      button.textContent =
        `${text} ×`;

      button.addEventListener(
        "click",
        removeFunction
      );

      activeFilters.appendChild(
        button
      );
    }


    if (state.keyword) {

      addFilter(
        `Search: ${state.keyword}`,
        () => {

          state.keyword = "";

          if (searchInput) {
            searchInput.value = "";
          }

          state.page = 1;

          renderProfiles();
        }
      );

    }


    if (state.city) {

      addFilter(
        `City: ${state.city}`,
        () => {

          state.city = "";

          if (citySelect) {
            citySelect.value = "";
          }

          state.page = 1;

          renderProfiles();
        }
      );

    }


    if (state.category) {

      addFilter(
        `Category: ${state.category}`,
        () => {

          state.category = "";

          state.page = 1;

          renderProfiles();
        }
      );

    }
  }


  /* =========================================
     SEARCH
  ========================================= */

  function runSearch() {

    state.keyword =
      searchInput?.value.trim() || "";

    state.city =
      citySelect?.value || "";

    state.page = 1;

    renderProfiles();
  }


  document
    .getElementById("searchButton")
    ?.addEventListener(
      "click",
      runSearch
    );


  searchInput?.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        runSearch();
      }

    }
  );


  /* =========================================
     CITY SELECT
  ========================================= */

  citySelect?.addEventListener(
    "change",
    () => {

      state.city =
        citySelect.value;

      state.page = 1;

      renderProfiles();
    }
  );


  /* =========================================
     SORT
  ========================================= */

  sortSelect?.addEventListener(
    "change",
    () => {

      state.sort =
        sortSelect.value;

      state.page = 1;

      renderProfiles();
    }
  );


  /* =========================================
     CATEGORY BUTTONS
  ========================================= */

  document
    .querySelectorAll("[data-category]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          state.category =
            button.dataset.category || "";

          state.page = 1;

          renderProfiles();

          listingsSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* =========================================
     CITY BUTTONS
  ========================================= */

  document
    .querySelectorAll("[data-city]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          state.city =
            button.dataset.city || "";

          if (citySelect) {
            citySelect.value =
              state.city;
          }

          state.page = 1;

          renderProfiles();

          listingsSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* =========================================
     CLEAR FILTERS
  ========================================= */

  document
    .getElementById("clearFilters")
    ?.addEventListener(
      "click",
      () => {

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

        renderProfiles();
      }
    );


  /* =========================================
     MOBILE MENU
  ========================================= */

  document
    .getElementById("mobileMenuButton")
    ?.addEventListener(
      "click",
      () => {

        document
          .getElementById("mainNavigation")
          ?.classList.toggle("open");

      }
    );


  /* =========================================
     CLOSE MOBILE MENU
     AFTER NAVIGATION CLICK
  ========================================= */

  document
    .querySelectorAll("#mainNavigation a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          document
            .getElementById("mainNavigation")
            ?.classList.remove("open");

        }
      );

    });


  /* =========================================
     TOAST
  ========================================= */

  const toast =
    document.getElementById("toast");

  window.showToast = message => {

    if (!toast) return;

    toast.textContent =
      String(message);

    toast.classList.add("show");

    window.setTimeout(
      () => {
        toast.classList.remove("show");
      },
      2500
    );
  };


  /* =========================================
     INITIAL RENDER
  ========================================= */

  console.log(
    "AfterDark AU loaded:",
    profiles.length,
    "fictional demo profiles"
  );

  renderProfiles();

});
