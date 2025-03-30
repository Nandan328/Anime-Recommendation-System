const cherrio = require("cheerio");
const axios = require("axios");

const BASE_URL = "https://hianime.to";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const getPopularAnime = async () => {
  const { data } = await axiosInstance.get("/most-popular");
  const $ = cherrio.load(data);
  const popularAnime = [];
  $("div.film_list-wrap > div").each((ind, el) => {
    popularAnime.push({
      id: $(el).find("a").attr("href").split("/")[1],
      title: $(el).find("img").attr("alt"),
      image_url: $(el).find("img").attr("data-src"),
      numberEp: $(el).find("div.tick-sub").text(),
      epAvg: $(el).find("span.fdi-duration").text(),
    });
  });
  return popularAnime;
};

const getSearchedAnime = async (search) => {
  const { data } = await axiosInstance.get(`/search?keyword=${search}`);
  const $ = cherrio.load(data);
  const searchedAnime = [];
  $("div.film_list-wrap > div").each((ind, el) => {
    searchedAnime.push({
      id: $(el).find("a").attr("href").split("/")[2],
      title: $(el).find("img").attr("alt"),
      jtitle: $(el).find("div.film-detail h3 a").attr("data-jname"),
      image_url: $(el).find("img").attr("data-src"),
      numberEp: $(el).find("div.tick-sub").text(),
      epAvg: $(el).find("span.fdi-duration").text(),
    });
  });
  let anime = searchedAnime;

  anime = anime.filter(
    (el) =>
      el.title.toLowerCase().includes(search.toLowerCase()) ||
      el.jtitle.toLowerCase().includes(search.toLowerCase())
  );
  
  anime = anime.sort((a, b) => {
    const aep = parseInt(a.numberEp);
    const bep = parseInt(b.numberEp);
    if (aep > bep) return -1;
    if (aep < bep) return 1;
  });
  return anime;
};

const getAnimePage = async (id) => {
  const { data } = await axiosInstance.get(`/${id}`);
  const $ = cherrio.load(data);
  const animePage = [];
  $("div.anis-content").each((ind, el) => {
    animePage.push({
      id: id,
      title: $(el).find("h2").text(),
      image_url: $(el).find("img").attr("src"),
      numberEp: $(el).find("div.tick-sub").text(),
      epAvg: $(el)
        .find("span.item")
        .text()
        .replace(/TV|ONA|OVA|Special|Movie/g, "")
        .trim(),
      description: $(el)
        .find("div.film-description")
        .text()
        .replace("[Written by MAL Rewrite]", "")
        .replace(/\n|/g, "")
        .trim(),
      genre: $(el)
        .find("div.item-list")
        .text()
        .replace(/\n|Genres:/g, "")
        .replace("Slice of Life", "Slice-of-Life")
        .replace("Martial Arts", "Martial-Arts")
        .replace("Super Power", "Super-Power")
        .replace("Shoujo Ai", "Shoujo-Ai")
        .replace("Shounen Ai", "Shounen-Ai")
        .split(" ")
        .filter((el) => el != ""),
      rating: $(el)
        .find("div.item-title")
        .text()
        .split("MAL Score:")[1]
        .trim()
        .slice(0, 4),
    });
  });
  return animePage;
};

module.exports = {
  getPopularAnime,
  getSearchedAnime,
  getAnimePage,
};
