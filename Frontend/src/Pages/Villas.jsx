import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function Villas() {
  const [villaData, setVillaData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loaderRef = useRef(null);

  // ================= FETCH VILLAS (PAGINATED) =================
  const fetchVillas = async (reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/villa/get-all",
        {
          params: {
            page,
            limit: 6,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
          },
        }
      );

      if (data.success) {
        setVillaData((prev) =>
          reset ? data.villas : [...prev, ...data.villas]
        );
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Error fetching villas", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD ON PAGE CHANGE =================
  useEffect(() => {
    fetchVillas();
  }, [page]);

  // ================= RESET ON FILTER CHANGE =================
  useEffect(() => {
    setVillaData([]);
    setPage(1);
    setHasMore(true);
    fetchVillas(true);
  }, [minPrice, maxPrice]);

  // ================= INFINITE SCROLL =================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-white my-8 text-center">
        All Villas
      </h1>

      {/* ================= FILTER ================= */}
      <div className="flex justify-center gap-4 my-6">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-2 rounded text-black"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-2 rounded text-black"
        />
      </div>

      {/* ================= VILLAS GRID ================= */}
      <div className="flex flex-wrap justify-center gap-4">
        {villaData.length > 0 ? (
          villaData.map((item) => (
            <Link
              key={item._id}
              to={`/villa/${item._id}`}
              className="relative group rounded-lg overflow-hidden"
            >
              <img
                src={`http://localhost:4000/images/${item.images[0]}`}
                alt=""
                className="size-56 object-cover"
              />

              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-all flex flex-col justify-end p-4 text-white">
                <h1 className="text-lg">{item.villaName}</h1>
                <p className="text-sm">{item.villaAddress}</p>
                <p className="text-lg">₹ {item.price}</p>
              </div>
            </Link>
          ))
        ) : (
          !loading && <p className="text-white mt-6">No villas found</p>
        )}
      </div>

      {/* ================= LOADER ================= */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="text-center text-white my-6"
        >
          {loading ? "Loading more villas..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}

export default Villas;
