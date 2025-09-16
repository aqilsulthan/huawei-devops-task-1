const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(cors());

// health check
app.get("/health", (_req, res) =>
  res.json({ status: "UP", time: new Date().toISOString() })
);

// routes
const formRoutes = require("./routes/form.routes");
app.use("/", formRoutes);

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong." } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));