import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);

  // -------- VILLAS (PAGINATION) --------
  const [villaData, setVillaData] = useState([]);
  const [location, setLocation] = useState("");
  const [villaPage, setVillaPage] = useState(1);
  const [villaHasMore, setVillaHasMore] = useState(true);
  const [villaLoading, setVillaLoading] = useState(false);

  // -------- ROOMS (PAGINATION) --------
  const [roomData, setRoomData] = useState([]);
  const [roomPage, setRoomPage] = useState(1);
  const [roomHasMore, setRoomHasMore] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);

  // ================= AUTH CHECK =================
  const checkUserLoggedInOrNot = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        data.user.role === "user" ? setUser(true) : setOwner(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH VILLAS =================
  const fetchVillasData = async ({ minPrice, maxPrice, sort } = {}) => {
    if (villaLoading || !villaHasMore) return;

    setVillaLoading(true);

    try {
      const { data } = await axios.get("/api/villa/get-all", {
        params: {
          page: villaPage,
          limit: 6,
          minPrice,
          maxPrice,
          sort,
          location,
        },
      });

      if (data.success) {
        setVillaData((prev) => [...prev, ...data.villas]);
        setVillaHasMore(data.pagination?.hasMore ?? false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVillaLoading(false);
    }
  };

  // ================= RESET VILLAS =================
  const resetVillas = () => {
    setVillaData([]);
    setVillaPage(1);
    setVillaHasMore(true);
  };

  // ================= FETCH ROOMS =================
  const fetchRoomsData = async () => {
    if (roomLoading || !roomHasMore) return;

    setRoomLoading(true);

    try {
      const { data } = await axios.get("/api/room/get-all", {
        params: {
          page: roomPage,
          limit: 8,
        },
      });

      if (data.success) {
        setRoomData((prev) =>
          roomPage === 1 ? data.rooms : [...prev, ...data.rooms]
        );
        setRoomHasMore(data.pagination?.hasMore ?? false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRoomLoading(false);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    checkUserLoggedInOrNot();
  }, []);

  useEffect(() => {
    fetchVillasData();
  }, [villaPage, location]);

  useEffect(() => {
    fetchRoomsData();
  }, [roomPage]);

  useEffect(() => {
    resetVillas();
   // fetchVillasData();
  }, [location]);

  const value = {
    navigate,
    user,
    setUser,
    owner,
    setOwner,

    // Villas
    villaData,
    fetchVillasData,
    setVillaPage,
    villaHasMore,
    villaLoading,
    resetVillas,
    location,
    setLocation,

    // Rooms
    roomData,
    setRoomPage,
    roomHasMore,
    roomLoading,

    axios,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
