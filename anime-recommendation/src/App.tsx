import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Recommendations from "./Pages/Recommendations";
import AnimePage from "./Pages/AnimePage";
import Navbar from "./Pages/Components/Navbar";
import SearchPage from "./Pages/SearchPage";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <>
      <RecoilRoot>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/anime/:name" element={<AnimePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<center>404 Not Found</center>} />
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
}

export default App;
