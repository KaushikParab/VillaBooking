import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { villasData, roomsData } from "../assets/assets.js";
import axios from "axios";
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [villaData, setVillaData] = useState([]);
  const [roomData, setRoomData] = useState([]);

  const checkUserLoggedInOrNot = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        if (data.user.role === "user") {
          setUser(true);
        } else {
          setOwner(true);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchVillasData = async () => {
    try {
      const { data } = await axios.get("/api/villa/get-all");
      if (data.success) {
        setVillaData(data.villas);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  const fetchRoomsData = async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");
      if (data.success) {
        setRoomData(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    checkUserLoggedInOrNot();
    fetchVillasData();
    fetchRoomsData();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    owner,
    setOwner,
    villaData,
    roomData,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
