const express = require("express");
const cors = require("cors");

const {
  getPopularAnime,
  getSearchedAnime,
  getAnimePage,
} = require("./animeAPI");

const { getRecommendations } = require("./recommendation");

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/popular", async (req, res) => {
  try {
    const popular = await getPopularAnime();
    res.status(200).json(popular);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Something went wrong");
  }
});

app.get("/api/search", async (req, res) => {
  const { search } = req.query;
  try {
    const data = await getSearchedAnime(search);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
});

app.get("/api/anime", async (req, res) => {
  const { id } = req.query;
  try {
    const data = await getAnimePage(id);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
});

app.get("/api/recommend", async (req, res) => {
  const { anime } = req.query;
  try {
    let animes = await getRecommendations(anime);
    let animeNames = animes.split(",").map((str) => str.trim());

    const resultsArr = await Promise.all(
      animeNames.map((name) => getSearchedAnime(name).catch(() => []))
    );

    const data = resultsArr.reduce((acc, temp, i) => {
      const filtered = temp.filter((e) => {
        const titleLower = e.title.toLowerCase();
        const jtitleLower = e.jtitle.toLowerCase();
        const searchLower = animeNames[i].toLowerCase();
        return titleLower === searchLower || jtitleLower === searchLower;
      });
      return [...acc, ...filtered];
    }, []);

    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
