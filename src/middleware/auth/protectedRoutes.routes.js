module.exports.protectedRoutes = [
  // User Routes
  { path: "/user/profile", methods: ["GET"] },
  { path: "/user/updateProfile", methods: ["PUT"] },
  { path: "/user/changePassword", methods: ["POST"] },
  { path: "/user/removeprofile", methods: ["DELETE"] },

  // Course Routes
  { path: "/course/create", methods: ["POST"] },
  { path: "/course/update", methods: ["PUT"] },
  { path: "/course/delete", methods: ["DELETE"] },
  { path: "/course/get/:id", methods: ["GET"] },
  { path: "/course/getall", methods: ["GET"] },

  // Subject Routes
  { path: "/subject/create", methods: ["POST"] },
  { path: "/subject/update/:id", methods: ["PUT"] },
  { path: "/subject/delete", methods: ["DELETE"] },
  { path: "/subject/get/:id", methods: ["GET"] },
  { path: "/subject/getall", methods: ["GET"] },
];
