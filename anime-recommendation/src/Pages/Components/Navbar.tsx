import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { animeState } from "./atom";
import { Link } from "react-router-dom";

function Navbar() {
  const [anime, setAnime] = useRecoilState<string>(animeState);

  const navigate = useNavigate();

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (anime) {
      setAnime(anime.trim());
      navigate(`/search?q=${encodeURIComponent(anime.trim())}`);
    }
  };

  return (
    <div className="navbar-outer">
      <div className="navbar">
        <h1>
          <a href="/">OnlyAnime</a>
        </h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/recommendations">Recommend</Link>
        </div>
        <form className="search" onSubmit={handelSubmit}>
          <input
            onChange={(e) => setAnime(e.target.value)}
            type="text"
            placeholder="Search anime..."
            value={anime}
            required
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <hr />
    </div>
  );
}

export default Navbar;
