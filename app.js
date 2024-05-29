require("dotenv/config");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { connectToDatabase } = require("./src/connection/db.connection");
const {
  errorHandleMidlleware,
} = require("./src/middleware/errorHandler.middleware");
const {
  applyAuthMiddleware,
} = require("./src/middleware/auth/applyauth.middleware");
const indexRoutes = require("./src/routes/index.routes");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

// [ database connection ]
connectToDatabase();

// Use cookie-parser middleware
app.use(cookieParser());

// [ session middleware ]
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    key: "practice",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: Number(process.env.SESSION_EXPIRE),
    },
  })
);

// Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// [ middleware ]
app.use(morgan("tiny"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//start
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// [ Serving static files ]
app.use("/src/uploads", express.static(path.join(__dirname, "src/uploads")));

// [ Auth middleware ]
app.use(applyAuthMiddleware);

// [ routes ]
app.use("/", indexRoutes);

// [ Use the custom error handling middleware ]
app.use(errorHandleMidlleware);

// [ server ]
app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT} 🏡🏡🏡`);
});
