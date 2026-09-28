/* =========================================
   AFTERDARK AU — FRONTEND JAVASCRIPT
========================================= */


/* =========================================
   DEMO LISTING DATA
========================================= */

const listings = [

    {
        id: 1,
        name: "Ava",
        city: "Sydney",
        category: "Independent",
        image: "assets/images/profile-1.jpg",
        featured: true,
        newest: 7,
        description:
            "Professional profile demo for the directory interface."
    },

    {
        id: 2,
        name: "Sophie",
        city: "Melbourne",
        category: "Studios",
        image: "assets/images/profile-2.jpg",
        featured: true,
        newest: 6,
        description:
            "Studio listing demo for frontend development."
    },

    {
        id: 3,
        name: "Liam",
        city: "Brisbane",
        category: "Agencies",
        image: "assets/images/profile-3.jpg",
        featured: false,
        newest: 5,
        description:
            "Agency profile demo with location information."
    },

    {
        id: 4,
        name: "Olivia",
        city: "Perth",
        category: "Independent",
        image: "assets/images/profile-4.jpg",
        featured: true,
        newest: 4,
        description:
            "Independent profile demo for the directory."
    },

    {
        id: 5,
        name: "Taylor",
        city: "Adelaide",
        category: "Services",
        image: "assets/images/profile-1.jpg",
        featured: false,
        newest: 3,
        description:
            "Service listing demo."
    },

    {
        id: 6,
        name: "Morgan",
        city: "Gold Coast",
        category: "Independent",
        image: "assets/images/profile-2.jpg",
        featured: false,
        newest: 2,
        description:
            "Gold Coast profile demo."
    },

    {
        id: 7,
        name: "Jordan",
        city: "Canberra",
        category: "Agencies",
        image: "assets/images/profile-3.jpg",
        featured: false,
        newest: 1,
        description:
            "Canberra agency listing demo."
    }

];


/* =========================================
   APPLICATION STATE
========================================= */

const state = {

    keyword: "",

    city: "",

    category: "",

    sort: "featured"

};


/* =========================================
   DOM ELEMENTS
========================================= */

const ageGate =
    document.getElementById("ageGate");

const enterWebsite =
    document.getElementById("enterWebsite");

const leaveWebsite =
    document.getElementById("leaveWebsite");

const searchInput =
    document.getElementById("searchInput");

const citySelect =
    document.getElementById("citySelect");

const searchButton =
    document.getElementById("searchButton");

const sortSelect =
    document.getElementById("sortSelect");

const listingGrid =
    document.getElementById("listingGrid");

const emptyState =
    document.getElementById("emptyState");

const clearFilters =
    document.getElementById("clearFilters");

const activeFilters =
    document.getElementById("activeFilters");

const mainNavigation =
    document.getElementById("mainNavigation");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const postListingButton =
    document.getElementById("postListingButton");

const toast =
    document.getElementById("toast");


/* =========================================
   AGE GATE
========================================= */

function checkAgeGate() {

    const confirmed =
        localStorage.getItem(
            "afterdarkAgeConfirmed"
        );

    if (confirmed === "yes") {

        ageGate.classList.add("hidden");

    }

}


checkAgeGate();


/* ENTER WEBSITE */

if (enterWebsite) {

    enterWebsite.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "afterdarkAgeConfirmed",
                "yes"
            );

            ageGate.classList.add(
                "hidden"
            );

        }
    );

}


/* LEAVE WEBSITE */

if (leaveWebsite) {

    leaveWebsite.addEventListener(
        "click",
        function () {

            document.body.innerHTML = `

                <main
                    style="
                        min-height:100vh;
                        display:grid;
                        place-items:center;
                        padding:30px;
                        text-align:center;
                        font-family:Arial,sans-serif;
                    "
                >

                    <div>

                        <h1>
                            Access unavailable
                        </h1>

                        <p>
                            This website is restricted
                            to adults aged 18+.
                        </p>

                    </div>

                </main>

            `;

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            function (character) {

                const entities = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                };

                return entities[
                    character
                ];

            }
        );

}


/* =========================================
   RENDER LISTINGS
========================================= */

function renderListings() {

    const keyword =
        state.keyword
            .toLowerCase()
            .trim();


    let results =
        listings.filter(
            function (listing) {

                const searchableText = (

                    listing.name +
                    " " +
                    listing.city +
                    " " +
                    listing.category +
                    " " +
                    listing.description

                ).toLowerCase();


                const matchesKeyword =
                    !keyword ||
                    searchableText.includes(
                        keyword
                    );


                const matchesCity =
                    !state.city ||
                    listing.city === state.city;


                const matchesCategory =
                    !state.category ||
                    listing.category ===
                    state.category;


                return (
                    matchesKeyword &&
                    matchesCity &&
                    matchesCategory
                );

            }
        );


    /* =====================================
       SORT
    ===================================== */

    if (state.sort === "featured") {

        results.sort(
            function (a, b) {

                return (
                    Number(b.featured) -
                    Number(a.featured)
                );

            }
        );

    }


    if (state.sort === "newest") {

        results.sort(
            function (a, b) {

                return b.newest -
                    a.newest;

            }
        );

    }


    if (state.sort === "name") {

        results.sort(
            function (a, b) {

                return a.name.localeCompare(
                    b.name
                );

            }
        );

    }


    /* =====================================
       EMPTY STATE
    ===================================== */

    if (results.length === 0) {

        listingGrid.innerHTML = "";

        emptyState.hidden = false;

    }

    else {

        emptyState.hidden = true;

    }


    /* =====================================
       CREATE LISTING CARDS
    ===================================== */

    listingGrid.innerHTML =
        results.map(
            function (listing) {

                return `

                    <article
                        class="listing-card"
                    >

                        <div
                            class="listing-photo"
                        >

                            <img
                                src="${escapeHtml(
                                    listing.image
                                )}"
                                alt="${escapeHtml(
                                    listing.name
                                )} profile"
                                loading="lazy"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
                            >

                            <div
                                class="photo-placeholder"
                                style="display:none"
                            >
                                Photo unavailable
                            </div>


                            ${
                                listing.featured
                                ?
                                `
                                <span
                                    class="featured-badge"
                                >
                                    FEATURED
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <div
                            class="listing-body"
                        >

                            <div
                                class="listing-top"
                            >

                                <h3>
                                    ${escapeHtml(
                                        listing.name
                                    )}
                                </h3>

                                <span
                                    class="listing-tag"
                                >
                                    ${escapeHtml(
                                        listing.category
                                    )}
                                </span>

                            </div>


                            <div
                                class="listing-meta"
                            >

                                ${escapeHtml(
                                    listing.city
                                )}
                                , Australia
                                • 18+

                            </div>


                            <p
                                class="listing-description"
                            >

                                ${escapeHtml(
                                    listing.description
                                )}

                            </p>


                            <div
                                class="listing-actions"
                            >

                                <button
                                    type="button"
                                    data-action="view"
                                    data-id="${listing.id}"
                                >
                                    View
                                </button>


                                <button
                                    type="button"
                                    data-action="contact"
                                    data-id="${listing.id}"
                                >
                                    Contact
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        ).join("");


    renderActiveFilters();

}


/* =========================================
   ACTIVE FILTERS
========================================= */

function renderActiveFilters() {

    activeFilters.innerHTML = "";


    const filters = [];


    if (state.keyword) {

        filters.push(
            "Search: " +
            state.keyword
        );

    }


    if (state.city) {

        filters.push(
            "City: " +
            state.city
        );

    }


    if (state.category) {

        filters.push(
            "Category: " +
            state.category
        );

    }


    filters.forEach(
        function (filter) {

            const chip =
                document.createElement(
                    "span"
                );

            chip.className =
                "filter-chip";

            chip.textContent =
                filter;

            activeFilters.appendChild(
                chip
            );

        }
    );

}


/* =========================================
   SEARCH
========================================= */

function performSearch() {

    state.keyword =
        searchInput.value;

    state.city =
        citySelect.value;


    renderListings();


    document
        .getElementById("listings")
        .scrollIntoView({
            behavior: "smooth"
        });

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        performSearch
    );

}


/* ENTER KEY SEARCH */

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                performSearch();

            }

        }
    );

}


/* =========================================
   CITY FILTER
========================================= */

document
    .querySelectorAll(
        "[data-city]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const city =
                        button.dataset.city;


                    state.city =
                        city;

                    citySelect.value =
                        city;


                    renderListings();


                    document
                        .getElementById(
                            "listings"
                        )
                        .scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );

        }
    );


/* =========================================
   CATEGORY FILTER
========================================= */

document
    .querySelectorAll(
        "[data-category]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".category-card"
                        )
                        .forEach(
                            function (card) {

                                card.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    state.category =
                        button.dataset.category;


                    renderListings();


                    document
                        .getElementById(
                            "listings"
                        )
                        .scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );

        }
    );


/* =========================================
   SORT
========================================= */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        function () {

            state.sort =
                sortSelect.value;

            renderListings();

        }
    );

}


/* =========================================
   CLEAR FILTERS
========================================= */

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        function () {

            state.keyword = "";

            state.city = "";

            state.category = "";

            state.sort = "featured";


            searchInput.value = "";

            citySelect.value = "";

            sortSelect.value =
                "featured";


            document
                .querySelectorAll(
                    ".category-card"
                )
                .forEach(
                    function (card) {

                        card.classList.remove(
                            "active"
                        );

                    }
                );


            renderListings();

        }
    );

}


/* =========================================
   LISTING BUTTONS
========================================= */

listingGrid.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {
            return;
        }


        const id =
            Number(
                button.dataset.id
            );


        const listing =
            listings.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!listing) {
            return;
        }


        if (
            button.dataset.action ===
            "view"
        ) {

            showToast(
                "Demo profile: " +
                listing.name
            );

        }


        if (
            button.dataset.action ===
            "contact"
        ) {

            showToast(
                "Demo contact flow: " +
                listing.name
            );

        }

    }
);


/* =========================================
   POST LISTING
========================================= */

if (postListingButton) {

    postListingButton.addEventListener(
        "click",
        function () {

            showToast(
                "Registration and listing submission will be connected here."
            );

        }
    );

}


/* =========================================
   MOBILE MENU
========================================= */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        function () {

            mainNavigation.classList.toggle(
                "open"
            );

        }
    );

}


/* CLOSE MOBILE MENU
   AFTER CLICKING A LINK
========================================= */

document
    .querySelectorAll(
        "#mainNavigation a"
    )
    .forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNavigation.classList.remove(
                        "open"
                    );

                }
            );

        }
    );


/* =========================================
   TOAST MESSAGE
========================================= */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================
   INITIAL RENDER
========================================= */

renderListings();
