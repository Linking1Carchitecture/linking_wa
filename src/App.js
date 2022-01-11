import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import MainNavigation from "./components/layout/MainNavigation";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  
  return (
    <div>
      <BrowserRouter>
        {/* <MainNavigation /> */}
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Navigate replace to="/"/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;