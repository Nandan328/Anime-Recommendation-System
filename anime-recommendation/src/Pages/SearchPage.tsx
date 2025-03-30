import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Components/Loader";
import Card from "./Components/Card";
import Error from "./Components/Error";

function SearchPage() {
  const URL = import.meta.env.VITE_URL;
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  const [loader, setLoader] = useState<boolean>(true);
  const [animeList, setAnimeList] = useState<Array<object>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    axios
      .get(`${URL}/search?search=${search}`)
      .then((res) => {
        setAnimeList(res.data);
        
      })
      .catch(() => {
        setError("Not found");
        
      }).finally(() => {
      setLoader(false);
    })
  }, [search]);

  if (!loader && animeList.length === 0)
    return <Error message="No results found" />;

  if (error) return <Error message={error} />;

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div className="container">
          {animeList.map((a: any) => (
            <Card key={a.id} anime={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
