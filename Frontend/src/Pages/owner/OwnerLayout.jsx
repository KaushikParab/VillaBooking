import { Warehouse, CalendarArrowDown, LayoutDashboard } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function OwnerLayout() {
  const location = useLocation();
  

  const dashboardicon = <LayoutDashboard className="w-6 h-6" />;
  const { owner, setOwner, axios } = useContext(AppContext);

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardicon },
    { name: "Rooms", path: "/owner/rooms", icon: <Warehouse /> },
    { name: "Bookings", path: "/owner/bookings", icon: <CalendarArrowDown /> },
  ];

  const navigate = useNavigate();
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setOwner(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-black transition-all duration-300">
        <Link to="/owner">
          <span
            className="h-9 font-extrabold text-2xl md:text-3xl tracking-wide 
               bg-gradient-to-r from-yellow-400 to-yellow-600 
               bg-clip-text text-transparent drop-shadow-md"
          >
            Stavilo
          </span>
        </Link>
        <div className="flex items-center gap-5 text-white/80">
          <p>Hi! Owner</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex ">
        <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                to={item.path}
                key={index}
                className={`flex items-center py-3 px-4 gap-3 transition-all
                  ${
                    isActive
                      ? "bg-indigo-500/20 border-r-4 border-indigo-500 text-indigo-400 font-semibold"
                      : "hover:bg-indigo-400/20 text-gray-300"
                  }
                `}
              >
                {item.icon}
                <p className="md:block hidden text-center">{item.name}</p>
              </Link>
            );
          })}
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default OwnerLayout;
