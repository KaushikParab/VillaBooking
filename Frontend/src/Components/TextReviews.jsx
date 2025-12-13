import React from "react";

function TextReviews() {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      date: "April 20, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      date: "June 5, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
    },
  ];

  const CreateCard = ({ card }) => (
    <div
      className="p-5 rounded-xl mx-4 bg-[#1E1E1E]/90 border border-[#2A2A2A] shadow-lg 
                        hover:shadow-xl hover:border-[#6A0DAD] transition-all duration-300 w-72 shrink-0"
    >
      <div className="flex gap-2">
        <img
          className="size-11 rounded-full border border-gray-700"
          src={card.image}
          alt="User"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="text-white font-medium">{card.name}</p>
            <svg
  className="mt-0.5"
  width="12"
  height="12"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M12 2L14.09 8.26L20.97 8.27L15.45 12.14L17.54 18.4L12 14.53L6.46 18.4L8.55 12.14L3.03 8.27L9.91 8.26L12 2Z"
    fill="#FFD369"
  />
</svg>

          </div>
          <span className="text-xs text-gray-500">{card.handle}</span>
        </div>
      </div>

      <p className="text-sm py-4 text-gray-300 leading-relaxed">
        Radiant made undercutting all of our competitors an absolute breeze.
      </p>

      <div className="flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center gap-1">
          <span>Posted on</span>
          <a
            href="https://x.com"
            target="_blank"
            className="hover:text-[#6A0DAD] transition-colors"
          >
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }
            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }
            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

      <div className="w-full bg-[#0D0D0D] py-12">
        {/* Top Row */}
        <div className="marquee-row w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0D0D0D] to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%]">
            {[...(cardsData || []), ...(cardsData || [])].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0D0D0D] to-transparent"></div>
        </div>

        {/* Bottom Row */}
        <div className="marquee-row w-full overflow-hidden relative mt-2">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0D0D0D] to-transparent"></div>
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%]">
            {[...(cardsData || []), ...(cardsData || [])].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0D0D0D] to-transparent"></div>
        </div>
      </div>
    </>
  );
}

export default TextReviews;
