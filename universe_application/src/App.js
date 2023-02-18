import logo from './logo.svg';
import './App.css';
import Chat from './Pages/Chat/Chat'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      hello
      <BrowserRouter>
        {/* <Routes> */}
          {/* <Route path="/" element={<Chat />}></Route>
          <Route path="/chat" element={<Chat />}></Route> */}
        {/* </Routes> */}
   </BrowserRouter>
    </div>

  );
}

export default App;
