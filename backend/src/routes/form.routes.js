const express = require("express");
const router = express.Router();
const { postForm, getForm } = require("../controllers/form.controller");
const { validateForm } = require("../middlewares/validate");

// API: POST /form dan GET /form
router.post("/form", validateForm, postForm);
router.get("/form", getForm);

module.exports = router;
