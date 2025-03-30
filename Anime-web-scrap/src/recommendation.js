const child_process = require("child_process");
const path = require("path")

const getRecommendations = (animes) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, "model", "util.py");
    const res = child_process.spawn("python", [filepath, animes]);
    res.stdout.on("data", (data) => {
      let s = data.toString().replace(/[\[\]']/g, "").trim();
      resolve(s);
    });
    res.stderr.on("data", (data) => {
      reject(data.toString());
    });
    res.on("error", (err) => {
      reject(err);
    });
    res.on("close", (code) => {
      if (code !== 0) {
        reject(`Process exited with code ${code}`);
      }
    });
  });
};

module.exports = { getRecommendations };