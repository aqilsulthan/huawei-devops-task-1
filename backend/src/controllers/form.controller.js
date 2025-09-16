const { formDataStore } = require("../storage/memory");

function postForm(req, res) {
  const { name, email, message } = req.body;

  //  name must not contain digits
  if (/\d/.test(name)) {
    return res.status(400).json({
      ok: false,
      error: {
        code: "INVALID_NAME",
        message: "Name must not contain numbers"
      }
    });
  }

  const record = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    message: String(message).trim(),
    createdAt: new Date().toISOString()
  };

  // prevent duplicate email
  if (formDataStore.some(d => d.email === record.email)) {
    return res.status(409).json({
      ok: false,
      error: {
        code: "EMAIL_DUPLICATE",
        message: "Email already exist"
      }
    });
  }

  formDataStore.push(record);
  return res.status(201).json({ ok: true, data: record });
}

function getForm(req, res) {
  const { search } = req.query || {};
  let data = formDataStore;

  if (search && String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    data = data.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    );

    if (data.length === 0) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "SEARCH_NOT_FOUND",
          message: `No record matched query '${search}'.`
        }
      });
    }

    return res.json({ ok: true, count: data.length, data });
  }

  return res.json({ ok: true, count: data.length, data });
}

module.exports = { postForm, getForm };