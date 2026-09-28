/* =========================================
   AFTERDARK AU
   DEMO PROFILE SEED GENERATOR

   Generates 1,000 fictional profiles.
   No external website scraping.
========================================= */

const DEMO_PROFILE_COUNT = 1000;

const AUSTRALIAN_LOCATIONS = [
    {
        city: "Sydney",
        state: "NSW"
    },
    {
        city: "Melbourne",
        state: "VIC"
    },
    {
        city: "Brisbane",
        state: "QLD"
    },
    {
        city: "Perth",
        state: "WA"
    },
    {
        city: "Adelaide",
        state: "SA"
    },
    {
        city: "Gold Coast",
        state: "QLD"
    },
    {
        city: "Canberra",
        state: "ACT"
    },
    {
        city: "Newcastle",
        state: "NSW"
    },
    {
        city: "Hobart",
        state: "TAS"
    },
    {
        city: "Darwin",
        state: "NT"
    }
];


const CATEGORIES = [
    "Independent",
    "Studios",
    "Agencies",
    "Services"
];


const FIRST_NAMES = [
    "Ava",
    "Sophie",
    "Olivia",
    "Mia",
    "Isla",
    "Ella",
    "Grace",
    "Chloe",
    "Amelia",
    "Ruby",
    "Lily",
    "Emily",
    "Harper",
    "Sienna",
    "Zoe",
    "Maya",
    "Aria",
    "Layla",
    "Ella",
    "Scarlett"
];


const LAST_INITIALS = [
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


/* =========================================
   RANDOM HELPERS
========================================= */

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


/* =========================================
   CREATE PHOTO SLOTS
========================================= */

function createPhotoSlots(profileId) {

    const photoCount =
        randomNumber(4, 20);

    const photos = [];


    for (
        let index = 1;
        index <= photoCount;
        index++
    ) {

        const paddedProfile =
            String(profileId)
                .padStart(4, "0");


        const paddedPhoto =
            String(index)
                .padStart(2, "0");


        photos.push({

            id:
                `${paddedProfile}-${paddedPhoto}`,

            /*
             * Placeholder path.
             *
             * Replace later with your own
             * authorized/generated image URL.
             */

            src:
                `assets/images/profiles/${paddedProfile}/photo-${paddedPhoto}.jpg`,

            alt:
                `Demo profile ${paddedProfile} photo ${paddedPhoto}`

        });

    }


    return photos;

}


/* =========================================
   CREATE ONE PROFILE
========================================= */

function createProfile(profileId) {

    const location =
        randomItem(
            AUSTRALIAN_LOCATIONS
        );


    const firstName =
        randomItem(
            FIRST_NAMES
        );


    const initial =
        randomItem(
            LAST_INITIALS
        );


    const category =
        randomItem(
            CATEGORIES
        );


    return {

        id:
            profileId,

        username:
            `${firstName.toLowerCase()}-${profileId}`,

        displayName:
            `${firstName} ${initial}.`,

        age:
            randomNumber(21, 45),

        city:
            location.city,

        state:
            location.state,

        country:
            "Australia",

        category:
            category,

        verified:
            Math.random() > 0.35,

        featured:
            Math.random() > 0.82,

        online:
            Math.random() > 0.5,

        createdAt:
            new Date(
                Date.now() -
                randomNumber(
                    1,
                    365
                ) *
                24 *
                60 *
                60 *
                1000
            ).toISOString(),

        description:
            "Fictional demo profile created for frontend testing. Replace this text with lawful, user-provided listing information.",

        photos:
            createPhotoSlots(
                profileId
            )

    };

}


/* =========================================
   GENERATE 1,000 PROFILES
========================================= */

function generateDemoProfiles(
    count = DEMO_PROFILE_COUNT
) {

    const profiles = [];


    for (
        let id = 1;
        id <= count;
        id++
    ) {

        profiles.push(
            createProfile(id)
        );

    }


    return profiles;

}


/* =========================================
   GENERATE DATA
========================================= */

const demoProfiles =
    generateDemoProfiles();


/* =========================================
   SAVE TO BROWSER
========================================= */

try {

    localStorage.setItem(
        "afterdarkDemoProfiles",
        JSON.stringify(
            demoProfiles
        )
    );

} catch (error) {

    console.error(
        "Unable to save demo profiles:",
        error
    );

}


/* =========================================
   GLOBAL ACCESS
========================================= */

window.afterdarkDemoProfiles =
    demoProfiles;


/* =========================================
   CONSOLE INFORMATION
========================================= */

console.log(
    `Generated ${demoProfiles.length} fictional demo profiles.`
);

console.log(
    "Maximum photo slots per profile: 20"
);


/* =========================================
   OPTIONAL EXPORT
========================================= */

if (
    typeof module !== "undefined" &&
    module.exports
) {

    module.exports =
        generateDemoProfiles;

}
