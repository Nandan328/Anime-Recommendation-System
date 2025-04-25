const child_process = require("child_process");
const pythonCmd = process.env.PYTHON_CMD || "python";
const path = require("path")

const getRecommendations = (animes) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, "model", "util.py");
    const res = child_process.spawn(pythonCmd, [filepath, animes]);
    console.log(filepath)
    res.stdout.on("data", (data) => {
      let s = data.toString().replace(/[\[\]']/g, "").trim();
      resolve(s);
    });
    res.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });
    res.on("error", (err) => {
      console.error(`Error: ${err}`);
      reject(err);
    });
    res.on("close", (code) => {
      if (code !== 0 || error) {
        reject(`Process exited with code ${code}. Error: ${error}`);
      } else {
        let s = output.replace(/[\[\]']/g, "").trim();
        resolve(s);
      }
    });
  });
};

module.exports = { getRecommendations };