// src/server.js
const app = require("./app");

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
