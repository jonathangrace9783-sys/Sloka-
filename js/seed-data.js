// js/seed-data.js

(() => {
  "use strict";

  // ==================================================
  // SETTINGS
  // ==================================================

  const DEMO_PROFILE_COUNT = 1000;

  const STORAGE_KEY =
    "afterdarkDemoProfiles";


  // ==================================================
  // LOCATIONS
  // ==================================================

  const locations = [
    {
      city: "Sydney",
      state: "NSW",
      country: "Australia"
    },
    {
      city: "Melbourne",
      state: "VIC",
      country: "Australia"
    },
    {
      city: "Brisbane",
      state: "QLD",
      country: "Australia"
    },
    {
      city: "Perth",
      state: "WA",
      country: "Australia"
    },
    {
      city: "Adelaide",
      state: "SA",
      country: "Australia"
    },
    {
      city: "Gold Coast",
      state: "QLD",
      country: "Australia"
    },
    {
      city: "Canberra",
      state: "ACT",
      country: "Australia"
    },
    {
      city: "Newcastle",
      state: "NSW",
      country: "Australia"
    },
    {
      city: "Hobart",
      state: "TAS",
      country: "Australia"
    },
    {
      city: "Darwin",
      state: "NT",
      country: "Australia"
    }
  ];


  // ==================================================
  // CATEGORIES
  // ==================================================

  const categories = [
    "Independent",
    "Studios",
    "Agencies",
    "Services"
  ];


  // ==================================================
  // DEMO NAMES
  // ==================================================

  const firstNames = [
    "Ava",
    "Sophie",
    "Olivia",
    "Mia",
    "Chloe",
    "Ella",
    "Grace",
    "Amelia",
    "Isla",
    "Ruby",
    "Emily",
    "Lily",
    "Zoe",
    "Harper",
    "Maya",
    "Emma",
    "Aria",
    "Layla",
    "Sienna",
    "Ella",
    "Taylor",
    "Morgan",
    "Jordan",
    "Alex",
    "Riley"
  ];


  const lastInitials = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "R",
    "S",
    "T"
  ];


  // ==================================================
  // DESCRIPTIONS
  // ==================================================

  const descriptions = [
    "Professional profile available in the local area.",
    "Independent profile with a polished presentation.",
    "Featured demo profile for directory testing.",
    "Demo profile created for testing search and filtering.",
    "Local directory profile with verified demo information.",
    "Professional demo listing with profile details.",
    "Example profile created for the Australia directory.",
    "Demo listing available for testing the profile system."
  ];


  // ==================================================
  // HELPERS
  // ==================================================

  function randomItem(array) {

    return array[
      Math.floor(
        Math.random() * array.length
      )
    ];

  }


  function randomNumber(min, max) {

    return Math.floor(
      Math.random() *
      (max - min + 1)
    ) + min;

  }


  function randomBoolean(probability = 0.5) {

    return Math.random() < probability;

  }


  function padNumber(number, length = 4) {

    return String(number)
      .padStart(length, "0");

  }


  // ==================================================
  // IMAGE PATH
  // ==================================================

  function getPhotoPath(profileNumber) {

    /*
      We currently use one standard demo image
      path.

      Later, real authorized images can be
      connected here.
    */

    return (
      "assets/images/profiles/" +
      "profile-" +
      padNumber(profileNumber) +
      ".jpg"
    );

  }


  // ==================================================
  // CREATE PHOTO SLOTS
  // ==================================================

  function createPhotoSlots(profileNumber) {

    const photoCount =
      randomNumber(4, 20);


    const photos = [];


    for (
      let i = 1;
      i <= photoCount;
      i++
    ) {

      /*
        For now all photo slots point to the
        profile's primary demo image.

        This keeps the demo lightweight.

        Later these can become:
        photo-01.jpg
        photo-02.jpg
        etc.
      */

      photos.push({

        id:
          `photo-${i}`,

        src:
          getPhotoPath(
            profileNumber
          ),

        alt:
          `Profile photo ${i}`

      });

    }


    return photos;

  }


  // ==================================================
  // CREATE PROFILE
  // ==================================================

  function createProfile(profileNumber) {

    const location =
      randomItem(locations);


    const firstName =
      randomItem(firstNames);


    const initial =
      randomItem(lastInitials);


    const category =
      randomItem(categories);


    const age =
      randomNumber(21, 45);


    const displayName =
      `${firstName} ${initial}.`;


    const username =
      `${firstName.toLowerCase()}${initial.toLowerCase()}${profileNumber}`;


    const id =
      `profile-${profileNumber}`;


    return {

      id,

      username,

      displayName,

      age,

      city:
        location.city,

      state:
        location.state,

      country:
        location.country,

      category,

      verified:
        randomBoolean(0.35),

      featured:
        randomBoolean(0.12),

      online:
        randomBoolean(0.45),

      createdAt:
        new Date(
          Date.now() -
          randomNumber(
            0,
            365
          ) *
          24 *
          60 *
          60 *
          1000
        ).toISOString(),

      description:
        randomItem(
          descriptions
        ),

      photos:
        createPhotoSlots(
          profileNumber
        )

    };

  }


  // ==================================================
  // GENERATE PROFILES
  // ==================================================

  function generateDemoProfiles(
    count
  ) {

    const profiles = [];


    for (
      let i = 1;
      i <= count;
      i++
    ) {

      profiles.push(
        createProfile(i)
      );

    }


    return profiles;

  }


  // ==================================================
  // LOAD / CREATE DATA
  // ==================================================

  let profiles = [];


  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (saved) {

      profiles =
        JSON.parse(saved);

    }

  } catch (error) {

    console.warn(
      "Could not read saved demo profiles.",
      error
    );

  }


  // If data does not exist or count is wrong,
  // generate fresh demo data.

  if (
    !Array.isArray(profiles) ||
    profiles.length !==
      DEMO_PROFILE_COUNT
  ) {

    profiles =
      generateDemoProfiles(
        DEMO_PROFILE_COUNT
      );


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profiles)
      );

    } catch (error) {

      console.warn(
        "Could not save demo profiles to localStorage.",
        error
      );

    }

  }


  // ==================================================
  // GLOBAL DATA
  // ==================================================

  window.afterdarkDemoProfiles =
    profiles;


  console.log(
    `Loaded ${profiles.length} demo profiles.`
  );


})();
