const express = require("express");
const router = express.Router();
const { getNearbyPlaces } = require("../controllers/locationController");

router.get("/nearby", getNearbyPlaces);

module.exports = router;