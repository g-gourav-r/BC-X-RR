import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Application from "./components/pages/application";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Application />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
