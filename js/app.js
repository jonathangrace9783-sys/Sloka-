document.addEventListener("DOMContentLoaded", () => {
  const ageGate = document.getElementById("ageGate");
  const enterSite = document.getElementById("enterSite");
  const leaveSite = document.getElementById("leaveSite");

  const menuButton = document.getElementById("menuButton");
  const siteMenu = document.getElementById("siteMenu");

  const searchToggle = document.getElementById("searchToggle");
  const mainSearch = document.getElementById("mainSearch");
  const searchInput = document.getElementById("searchInput");

  const citySelect = document.getElementById("citySelect");
  const categorySelect = document.getElementById("categorySelect");
  const sortSelect = document.getElementById("sortSelect");

  const listingGrid = document.getElementById("listingGrid");
  const resultsText = document.getElementById("resultsText");
  const noResults = document.getElementById("noResults");
  const pagination = document.getElementById("pagination");

  const cityFilters = document.querySelectorAll(".city-filter");
  const cityCards = document.querySelectorAll(".city-card");
  const categoryLinks = document.querySelectorAll(".category-more");

  let currentPage = 1;

  const pageSize =
    typeof PROFILE_CONFIG !== "undefined"
      ? PROFILE_CONFIG.pageSize
      : 24;

  /*
    -------------------------
    AGE VERIFICATION
    -------------------------
  */

  function checkAgeGate() {
    const verified = localStorage.getItem("slokkaAgeVerified");

    if (verified === "true") {
      ageGate.classList.add("hidden");
      document.body.classList.remove("age-locked");
    } else {
      ageGate.classList.remove("hidden");
      document.body.classList.add("age-locked");
    }
  }

  enterSite?.addEventListener("click", () => {
    localStorage.setItem("slokkaAgeVerified", "true");
    ageGate.classList.add("hidden");
    document.body.classList.remove("age-locked");
  });

  leaveSite?.addEventListener("click", () => {
    window.location.href = "https://www.google.com/";
  });

  checkAgeGate();

  /*
    -------------------------
    MOBILE MENU
    -------------------------
  */

  menuButton?.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  document.querySelectorAll(".site-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      siteMenu.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  /*
    -------------------------
    SEARCH BUTTON
    -------------------------
  */

  searchToggle?.addEventListener("click", () => {
    document.querySelector(".hero-section")?.scrollIntoView({
      behavior: "smooth"
    });

    setTimeout(() => {
      searchInput?.focus();
    }, 500);
  });

  /*
    -------------------------
    FILTER FUNCTION
    -------------------------
  */

  function getFilteredProfiles() {
    if (!Array.isArray(profiles)) {
      return [];
    }

    const city = citySelect.value;
    const category = categorySelect.value;
    const searchTerm = searchInput.value
      .trim()
      .toLowerCase();

    let filtered = profiles.filter((profile) => {

      /*
        Pending profiles are not shown
        as public live listings.
      */

      if (profile.status && profile.status !== "live") {
        return false;
      }

      if (
        city !== "all" &&
        profile.city !== city
      ) {
        return false;
      }

      if (
        category !== "all" &&
        profile.category !== category
      ) {
        return false;
      }

      if (searchTerm) {
        const searchableText = [
          profile.name,
          profile.city,
          profile.state,
          profile.category,
          profile.description
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    /*
      SORT
    */

    switch (sortSelect.value) {

      case "name":
        filtered.sort((a, b) =>
          String(a.name).localeCompare(
            String(b.name)
          )
        );
        break;

      case "featured":
        filtered.sort((a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured))
        );
        break;

      case "newest":
      default:
        filtered.sort((a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
        break;
    }

    return filtered;
  }

  /*
    -------------------------
    PROFILE CARD
    -------------------------
  */

  function createProfileCard(profile) {
    const card = document.createElement("article");

    card.className = "profile-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "profile-card-image";

    const image = document.createElement("img");

    /*
      Only use an actual authorized image.
    */

    if (profile.image) {
      image.src = profile.image;
      image.alt = `${profile.name} listing`;
    } else {
      image.src =
        "assets/images/profiles/placeholder.svg";

      image.alt = "Profile image placeholder";
    }

    image.loading = "lazy";

    image.addEventListener(
      "error",
      () => {
        image.src =
          "assets/images/profiles/placeholder.svg";
      },
      { once: true }
    );

    imageWrapper.appendChild(image);

    const body = document.createElement("div");
    body.className = "profile-card-body";

    const title = document.createElement("h3");
    title.textContent = profile.name;

    const location = document.createElement("div");
    location.className = "profile-location";
    location.textContent =
      `${profile.city}, ${profile.state}`;

    const category = document.createElement("span");
    category.className = "profile-category";
    category.textContent = profile.category;

    const description = document.createElement("p");
    description.textContent =
      profile.description || "Directory listing.";

    const viewButton = document.createElement("a");

    viewButton.className = "profile-view";
    viewButton.href =
      `profile.html?id=${encodeURIComponent(profile.id)}`;

    viewButton.textContent = "View listing →";

    body.appendChild(title);
    body.appendChild(location);
    body.appendChild(category);
    body.appendChild(description);
    body.appendChild(viewButton);

    card.appendChild(imageWrapper);
    card.appendChild(body);

    return card;
  }

  /*
    -------------------------
    RENDER LISTINGS
    -------------------------
  */

  function renderListings() {
    const filteredProfiles = getFilteredProfiles();

    listingGrid.innerHTML = "";

    if (filteredProfiles.length === 0) {
      noResults.hidden = false;

      resultsText.textContent =
        "No live listings match your search.";

      pagination.innerHTML = "";

      return;
    }

    noResults.hidden = true;

    const totalPages = Math.ceil(
      filteredProfiles.length / pageSize
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const start =
      (currentPage - 1) * pageSize;

    const end =
      start + pageSize;

    const pageProfiles =
      filteredProfiles.slice(start, end);

    pageProfiles.forEach((profile) => {
      listingGrid.appendChild(
        createProfileCard(profile)
      );
    });

    resultsText.textContent =
      `${filteredProfiles.length} listing${filteredProfiles.length === 1 ? "" : "s"} found`;

    renderPagination(totalPages);
  }

  /*
    -------------------------
    PAGINATION
    -------------------------
  */

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    const previous = document.createElement("button");

    previous.type = "button";
    previous.textContent = "←";
    previous.disabled = currentPage === 1;

    previous.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderListings();
        scrollToListings();
      }
    });

    pagination.appendChild(previous);

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      const button =
        document.createElement("button");

      button.type = "button";
      button.textContent = page;

      if (page === currentPage) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentPage = page;
        renderListings();
        scrollToListings();
      });

      pagination.appendChild(button);
    }

    const next =
      document.createElement("button");

    next.type = "button";
    next.textContent = "→";

    next.disabled =
      currentPage === totalPages;

    next.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderListings();
        scrollToListings();
      }
    });

    pagination.appendChild(next);
  }

  function scrollToListings() {
    document
      .getElementById("listings")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  /*
    -------------------------
    SELECT FILTERS
    -------------------------
  */

  citySelect?.addEventListener("change", () => {
    currentPage = 1;
    updateCityButtons(citySelect.value);
    renderListings();
  });

  categorySelect?.addEventListener("change", () => {
    currentPage = 1;
    renderListings();
  });

  sortSelect?.addEventListener("change", () => {
    currentPage = 1;
    renderListings();
  });

  /*
    -------------------------
    MAIN SEARCH
    -------------------------
  */

  mainSearch?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      currentPage = 1;

      renderListings();

      scrollToListings();
    }
  );

  /*
    -------------------------
    CITY BUTTONS
    -------------------------
  */

  function updateCityButtons(city) {
    cityFilters.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.city === city
      );
    });
  }

  cityFilters.forEach((button) => {
    button.addEventListener("click", () => {

      const city =
        button.dataset.city || "all";

      citySelect.value = city;

      currentPage = 1;

      updateCityButtons(city);

      renderListings();

      scrollToListings();
    });
  });

  /*
    -------------------------
    CITY CARDS
    -------------------------
  */

  cityCards.forEach((card) => {
    card.addEventListener("click", () => {

      const city =
        card.dataset.city || "all";

      citySelect.value = city;

      currentPage = 1;

      updateCityButtons(city);

      renderListings();
    });
  });

  /*
    -------------------------
    CATEGORY LINKS
    -------------------------
  */

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {

      const category =
        link.dataset.category || "all";

      categorySelect.value = category;

      currentPage = 1;

      renderListings();
    });
  });

  /*
    -------------------------
    INITIAL RENDER
    -------------------------
  */

  renderListings();
});
