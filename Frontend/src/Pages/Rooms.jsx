import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import RoomCard from "../Components/RoomCard";

function Rooms() {
  const { roomData, setRoomPage, roomHasMore, roomLoading } =
    useContext(AppContext);

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && roomHasMore) {
        setRoomPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [roomHasMore]);

  return (
    <div className="py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-white my-8 text-center">
        All Rooms
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
        {roomData.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>

      {roomHasMore && (
        <div ref={loaderRef} className="text-center text-white my-6">
          {roomLoading ? "Loading more rooms..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}

export default Rooms;
