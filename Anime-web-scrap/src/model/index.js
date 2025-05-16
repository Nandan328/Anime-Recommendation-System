const fs = require("fs");
const path = require("path");
const { cosine } = require("ml-distance").similarity;
const { Matrix } = require("ml-matrix");
const _ = require("lodash");

// Load data
const MODEL_PATH = path.join(__dirname, "models_data.json");
const data = JSON.parse(fs.readFileSync(MODEL_PATH));

// 1. MultiLabelBinarizer for genres
const allGenres = Array.from(
  new Set(data.flatMap((anime) => anime.genre.split(", ").map((g) => g.trim())))
);

function binarizeGenres(animeList) {
  return animeList.map((anime) => {
    const genres = anime.genre.split(", ").map((g) => g.trim());
    return allGenres.map((g) => (genres.includes(g) ? 1 : 0));
  });
}

// 2. Normalize members (MinMaxScaler)
function normalize(array) {
  const min = Math.min(...array);
  const max = Math.max(...array);
  return array.map((val) => (val - min) / (max - min));
}

// 3. Main recommendation logic
function recommendAnimeByName(animeName) {
  const animeIndex = data.findIndex((anime) => anime.name === animeName);
  if (animeIndex === -1) throw new Error("Anime not found.");

  // Genre matrix and normalized members
  const genreMatrix = binarizeGenres(data);
  const members = data.map((anime) => anime.members);
  const membersNormalized = normalize(members);

  const genreVectors = new Matrix(genreMatrix);
  const targetVector = genreVectors.getRow(animeIndex);

  const similarities = genreMatrix.map((vector, index) => {
    if (index === animeIndex) return -1;

    const genreSim = cosine(targetVector, vector);
    const memberScore = membersNormalized[index];
    return 0.75 * genreSim + 0.25 * memberScore;
  });

  const topIndices = similarities
    .map((score, index) => ({ index, score }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ index }) => index);

  return topIndices.map((i) => data[i].name);
}
  module.exports = {
    recommendAnimeByName
  }
