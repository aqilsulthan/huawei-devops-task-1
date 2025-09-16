function validateForm(req, res, next) {
  const { name, email, message } = req.body || {};

  // mandatory field (name, email, message)
  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Fields 'name', 'email', and 'message' are required."
      }
    });
  }

  if ([name, email, message].some(v => typeof v !== "string")) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "All fields must be strings."
      }
    });
  }

  // email format validation
  const emailLike = /\S+@\S+\.\S+/;
  if (!emailLike.test(email)) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid email format."
      }
    });
  }

  next();
}

module.exports = { validateForm };