import { useNavigate } from "react-router-dom";

interface Anime {
  id: string;
  title: string;
  image_url: string;
  numberEp: string;
  epAvg: string;
}

function Card({ anime }: {anime: Anime }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/anime/${anime.id}`)} className="card">
      <div className="card-img">
        <img src={anime.image_url} alt={anime.title} loading="lazy" />
      </div>
      <hr />
      <div className="card-info">
        <h1>
          {anime.title.length > 10
            ? anime.title.slice(0, 10) + ".."
            : anime.title}
        </h1>
        <p>
          <span>EP: </span>
          {anime.numberEp}
        </p>
        <p>
          <span> </span>
          {anime.epAvg}
        </p>
      </div>
    </div>
  );
}

export default Card;
