import app from "./server/index.js";

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`SOFALA Supply Intelligence running on port ${port}`);
});
