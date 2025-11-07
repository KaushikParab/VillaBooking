import {Routes, Route, useLocation} from "react-router-dom";
import Home from "./Pages/Home";
import Villas from "./Pages/Villas";
import Rooms from "./Pages/Rooms";
import SingleRoom from "./Pages/SingleRoom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import About from "./Pages/About";
import MyBookings from "./Pages/MyBookings";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  const ownerPath = useLocation().pathname.includes("owner");
  return (
    <>
    <Toaster/>
    {
      !ownerPath && <Navbar/>
    }
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/villas' element={<Villas/>}/>
        <Route path='/rooms' element={<Rooms/>}/>
        <Route path='/room/:id' element={<SingleRoom/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
      </Routes>
      {
      !ownerPath && <Footer/>
    }
    </>
  )
}

export default App
