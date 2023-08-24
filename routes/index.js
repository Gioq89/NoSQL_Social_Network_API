const router = require("express").Router();
const apiRoutes = require("./api");

// add prefix of `/api` to all of the api routes imported from the `api` directory
router.use("/api", apiRoutes);

// if route is not found, send Route not found! message
router.use((req, res) => {
  res.send("Route not found!");
});

module.exports = router;
