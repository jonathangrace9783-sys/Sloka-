(() => {
  "use strict";

  const COUNT = 1000;
  const STORAGE_KEY = "afterdarkDemoProfilesV3";

  const cities = [
    ["Sydney", "NSW"],
    ["Melbourne", "VIC"],
    ["Brisbane", "QLD"],
    ["Perth", "WA"],
    ["Adelaide", "SA"],
    ["Gold Coast", "QLD"],
    ["Canberra", "ACT"],
    ["Newcastle", "NSW"],
    ["Hobart", "TAS"],
    ["Darwin", "NT"]
  ];

  const categories = [
    "Independent",
    "Studios",
    "Agencies",
    "Services"
  ];

  const names = [
    "Avery",
    "Mia",
    "Sophie",
    "Ella",
    "Chloe",
    "Ruby",
    "Zoe",
    "Isla",
    "Lily",
    "Nora",
    "Aria",
    "Maya",
    "Eva",
    "Lucy",
    "Ivy",
    "Amelia",
    "Grace",
    "Layla",
    "Emma",
    "Olivia"
  ];

  const descriptions = [
    "Fictional demo profile for testing the directory layout.",
    "Professional demo listing created for website testing.",
    "Sample profile for testing search, filters and pagination.",
    "Fictional profile used for the AfterDark AU demonstration."
  ];

  function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function pad(number) {
    return String(number).padStart(4, "0");
  }

  function randomDate() {
    const daysAgo = Math.floor(Math.random() * 730);

    return new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();
  }

  function createProfile(index) {
    const [city, state] = pick(cities);
    const firstName = pick(names);

    return {
      id: `profile-${index}`,

      username:
        `${firstName.toLowerCase()}_${pad(index)}`,

      displayName:
        `${firstName} ${String.fromCharCode(65 + (index % 26))}.`,

      age:
        21 + (index % 25),

      city,
      state,
      country: "Australia",

      category:
        pick(categories),

      verified:
        Math.random() < 0.38,

      featured:
        Math.random() < 0.12,

      online:
        Math.random() < 0.45,

      createdAt:
        randomDate(),

      description:
        pick(descriptions),

      photos: [
        "assets/images/profiles/placeholder.svg"
      ]
    };
  }

  function loadProfiles() {
    let stored = null;

    try {
      stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );
    } catch (error) {
      stored = null;
    }

    if (
      Array.isArray(stored) &&
      stored.length === COUNT
    ) {
      return stored;
    }

    const profiles = Array.from(
      { length: COUNT },
      (_, index) => createProfile(index + 1)
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profiles)
      );
    } catch (error) {
      // LocalStorage unavailable or full.
    }

    return profiles;
  }

  window.afterdarkDemoProfiles = loadProfiles();

  console.log(
    "AfterDark AU:",
    window.afterdarkDemoProfiles.length,
    "fictional demo profiles loaded."
  );
})();
