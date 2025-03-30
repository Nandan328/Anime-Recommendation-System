import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./Components/Card";
import Loader from "./Components/Loader";
import Error from "./Components/Error";

function Home() {
  const URL = import.meta.env.VITE_URL;
  const [anime, setAnime] = useState<Array<object>>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${URL}/popular`)
      .then((res) => {
        setAnime(res.data);
      })
      .catch((err) => {
        console.log(err)
        setError("Server Down");
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  if(error) return <Error message={error} />

  return (
    <>
      <h1 className="head">Popular Anime:</h1>
      {loader ? (
        <Loader />
      ) : (
        <div className="container">
          {anime.map((a: any) => (
            <Card key={a.id} anime={a} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
