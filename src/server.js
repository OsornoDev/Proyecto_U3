import app from "./app.js";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`transaction-validator listening on port ${port}`);
});
