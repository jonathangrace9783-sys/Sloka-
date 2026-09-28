/*
  Slokka profile data

  IMPORTANT:
  - Each live profile must have its own authorized image URL.
  - Do not publish someone's photo without permission.
  - Replace the sample records below with real, consented listing data.
*/

const profiles = [
  {
    id: 1,
    name: "Profile 001",
    city: "Sydney",
    state: "NSW",
    category: "Escorts",
    image: "",
    description: "Verified directory listing.",
    verified: false,
    featured: false,
    status: "pending",
    createdAt: "2026-09-28"
  },

  {
    id: 2,
    name: "Profile 002",
    city: "Melbourne",
    state: "VIC",
    category: "Transsexual",
    image: "",
    description: "Verified directory listing.",
    verified: false,
    featured: false,
    status: "pending",
    createdAt: "2026-09-28"
  },

  {
    id: 3,
    name: "Profile 003",
    city: "Brisbane",
    state: "QLD",
    category: "Male Escorts",
    image: "",
    description: "Verified directory listing.",
    verified: false,
    featured: false,
    status: "pending",
    createdAt: "2026-09-28"
  },

  {
    id: 4,
    name: "Profile 004",
    city: "Perth",
    state: "WA",
    category: "Adult Meetings",
    image: "",
    description: "Verified directory listing.",
    verified: false,
    featured: false,
    status: "pending",
    createdAt: "2026-09-28"
  }
];

/*
  Configuration
  ------------------------------------
  When the real backend is connected,
  profiles can be loaded from an API/database
  instead of keeping all records here.
*/

const PROFILE_CONFIG = {
  pageSize: 24,
  defaultCity: "all",
  defaultCategory: "all",
  defaultSort: "newest"
};
