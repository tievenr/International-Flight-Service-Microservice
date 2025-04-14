// src/utils/pnrGenerator.js
const generatePNR = () => {
  // Generate a 6-character alphanumeric PNR
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pnr = "";
  for (let i = 0; i < 6; i++) {
    pnr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return pnr;
};

module.exports = { generatePNR };
