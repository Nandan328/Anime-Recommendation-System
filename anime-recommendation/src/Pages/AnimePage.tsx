import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "./Components/Loader";


interface ArnimeData {
  title: string;
  description: string;
  image_url: string;
  genre: string[];
  numberEp: string;
  epAvg: string;
  rating: string;
}
function AnimePage() {
  const URL = import.meta.env.VITE_URL;
  const [anime, setAnime] = useState<string | undefined>("0");
  const [animeData, setAnimeData] = useState<ArnimeData>({
    title: "",
    description: "",
    image_url: "",
    genre: [],
    numberEp: "",
    epAvg: "",
    rating: "",
  });
  const [loader, setloader] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/anime/?id=${anime}`)
      .then((res) => {
        setAnimeData(res.data[0]);
        setloader(false);
      });
  }, [anime]);
  if (anime === "0") setAnime(useParams().name);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="anime-page">
          <div className="anime-img">
            <img
              src={animeData.image_url}
              alt={animeData.title}
              loading="lazy"
            />
          </div>
          <div className="anime-info">
            <h1>{animeData.title}</h1>
            <div>
              <p>
                <span>Overview:</span>
              </p>
              <p>{animeData.description}</p>
            </div>
            <div>
              <p>
                <span>Episodes: </span> {animeData.numberEp}
              </p>
            </div>
            <div>
              <p>
                <span>Duration: </span> {animeData.epAvg}in
              </p>
            </div>
            <div className="genres">
              <span>Genres:</span>
              <div>
                {animeData.genre.map((g: string) => {
                  return (
                    <span className="genre" key={g}>
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <p>
                <span>MAL Rating: </span>
                {animeData.rating}
              </p>
            </div>
            <div className="watch-now">
              <a href={"https://hianime.to/watch/" + anime}>Watch Now?</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnimePage;
