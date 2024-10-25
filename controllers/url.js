// const shortid = require("shortid");
const URL = require("../models/url");
const crypto = require('crypto');


function generateShortID() {
  // Generate a 2-byte random value and convert it to a hex string (4 characters)
  return crypto.randomBytes(2).toString('hex');
}

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Correctly generate the shortID
  const shortID = generateShortID();

  // Create the URL document in MongoDB
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
 return res.render('home',{
     id:shortID
 })

}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};