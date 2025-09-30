import { Routes, Route } from "react-router-dom";
import Main from "./components/main/main";

import "./App.css";

export default function App() {
  return (
    <div className="App">
      <div id="subRoot" className="content">
          <Routes>
            <Route path="/" element={<Main />}></Route>
          </Routes>
      </div>
    </div>
  );
}
