const child_process = require("child_process");
const pythonCmd = process.env.PYTHON_CMD || "python3";
const path = require("path")

const getRecommendations = (animes) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, "model", "util.py");
    const res = child_process.spawn(pythonCmd, [filepath, animes]);
    let output = "";
    let error = "";

    res.stderr.on("data", (data) => {
      error += data.toString();
      console.error(`Python stderr: ${data.toString()}`);
    });

    res.on("error", (err) => {
      console.error("Failed to start subprocess:", err);
      reject(err);
    });

    res.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      if (code !== 0 || error) {
        console.error(`Python stderr: ${error}`);
        reject(`Process exited with code ${code}. Error: ${error}`);
      } else {
        let s = output.replace(/[\[\]']/g, "").trim();
        resolve(s);
      }
    });
  });
};

module.exports = { getRecommendations };