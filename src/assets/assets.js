import add_icon from "./add_icon.png";
import bath_icon from "./bath_icon.png";
import bed_icon from "./bed_icon.png";
import calendar_icon from "./calendar_icon.png";
import camera_icon from "./camera_icon.png";
import dashboard_icon from "./dashboard_icon.png";
import delete_icon from "./delete_icon.png";
import dining_icon from "./dining_icon.png";
import edit_icon from "./edit_icon.png";
import freezer_icon from "./freezer_icon.png";
import hero_img from "./hero_img.png";
import img1 from "./img1.png";
import img2 from "./img2.png";
import img3 from "./img3.png";
import location_icon from "./location_icon.png";
import location from "./location.png";
// import logo from "./logo.png";
import meter_icon from "./meter_icon.png";
import offer_img1 from "./offer_img1.png";
import offer_img2 from "./offer_img2.png";
import offer_img3 from "./offer_img3.png";
import offer_img4 from "./offer_img4.png";
import offer_img5 from "./offer_img5.png";
import profile_icon from "./profile_icon.png";
import room_icon from "./room_icon.png";
import tv_icon from "./tv_icon.png";
import user_icon from "./user_icon.png";
import users_icon from "./users_icon.png";
import wifi_icon from "./wifi_icon.png";

export const assets = {
  hero_img,
  user_icon,
  location,
  calendar_icon,
  profile_icon,
  add_icon,
  delete_icon,
  edit_icon,
  freezer_icon,
  dashboard_icon,
};

export const cities = [
  "Mumbai",
  "Goa",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Lahore",
  "Karachi",
  "Murree",
  "Nashik",
  "Pune",
  "Islamabad",
];
export const homePageData = [
  {
    icon: users_icon,
    title: "users",
    value: "2500",
  },
  {
    icon: camera_icon,
    title: "treasures",
    value: "400",
  },
  {
    icon: location_icon,
    title: "cities",
    value: "200",
  },
];

export const hotelsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop",
    name: "Grand Palace Hotel",
    address: "123 Royal Street, Manhattan, New York, NY 10001",
    rating: 4.8,
    price: "$299",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
    ownerName: "Robert Wilson",
    contactNumber: "+1 (555) 123-4567",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop",
    name: "Ocean View Resort",
    address: "456 Beachfront Ave, Miami Beach, FL 33139",
    rating: 4.6,
    price: "$199",
    amenities: ["WiFi", "Beach Access", "Pool", "Bar"],
    ownerName: "Maria Rodriguez",
    contactNumber: "+1 (555) 987-6543",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop",
    name: "Mountain Lodge Retreat",
    address: "789 Pine Valley Road, Aspen, CO 81611",
    rating: 4.7,
    price: "$349",
    amenities: ["WiFi", "Fireplace", "Ski Access", "Restaurant"],
    ownerName: "David Thompson",
    contactNumber: "+1 (555) 456-7890",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop",
    name: "Downtown Business Inn",
    address: "321 Commerce Street, Chicago, IL 60601",
    rating: 4.3,
    price: "$159",
    amenities: ["WiFi", "Business Center", "Gym", "Parking"],
    ownerName: "Jennifer Chen",
    contactNumber: "+1 (555) 234-5678",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop",
    name: "Historic Boutique Hotel",
    address: "567 Heritage Lane, Savannah, GA 31401",
    rating: 4.9,
    price: "$279",
    amenities: ["WiFi", "Historic Tours", "Garden", "Restaurant"],
    ownerName: "Michael Anderson",
    contactNumber: "+1 (555) 345-6789",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop",
    name: "Luxury City Suites",
    address: "890 Executive Blvd, Los Angeles, CA 90210",
    rating: 4.5,
    price: "$399",
    amenities: ["WiFi", "Concierge", "Rooftop Pool", "Valet"],
    ownerName: "Sarah Johnson",
    contactNumber: "+1 (555) 567-8901",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=300&h=200&fit=crop",
    name: "Cliffside Horizon Villa",
    address: "Caldera Rim, Imerovigli, Santorini 84700, Greece",
    rating: 4.9,
    price: "$910",
    amenities: ["WiFi", "Infinity Pool", "Sun Terrace", "Room Service"],
    ownerName: "Nikolas Papadopoulos",
    contactNumber: "+30 2286 0 55555",
  },
  {
    id: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsmROXQ1JMqgspEED5c2T9nAsQ7hTwesEYNg&s",
    name: "Minimalist Ocean Villa",
    address: "Bondi Beach, NSW 2026, Australia",
    rating: 4.7,
    price: "$620",
    amenities: ["WiFi", "Beach Access", "Garage", "Workspace"],
    ownerName: "Charlotte Evans",
    contactNumber: "+61 2 5550 7700",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
    name: "Tropical Canopy Villa",
    address: "Jalan Raya Sayan, Ubud, Bali 80571, Indonesia",
    rating: 4.8,
    price: "$575",
    amenities: ["WiFi", "Plunge Pool", "Hammock", "Breakfast"],
    ownerName: "Nyoman Aditya",
    contactNumber: "+62 361 555 1188",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1529511582893-2d7e684dd128?w=300&h=200&fit=crop",
    name: "Alpine View Chalet",
    address: "Chemin des Bouquetins, Zermatt 3920, Switzerland",
    rating: 4.8,
    price: "$690",
    amenities: ["WiFi", "Sauna", "Fireplace", "Balcony"],
    ownerName: "Lukas Meier",
    contactNumber: "+41 27 555 44 22",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1459535653751-d571815e906b?w=300&h=200&fit=crop",
    name: "Mediterranean Courtyard Villa",
    address: "Carretera de Deià, Mallorca 07179, Spain",
    rating: 4.6,
    price: "$445",
    amenities: ["WiFi", "Courtyard", "Outdoor Kitchen", "Parking"],
    ownerName: "Isabella Ruiz",
    contactNumber: "+34 971 555 120",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&h=200&fit=crop",
    name: "Lagoon Breeze Pavilion",
    address: "Beau Vallon, Mahé, Seychelles",
    rating: 4.7,
    price: "$655",
    amenities: ["WiFi", "Deck Seating", "Air Conditioning", "Restaurant"],
    ownerName: "Aisha M.",
    contactNumber: "+248 4 555 707",
  },
];
export const roomsData = [
  {
    _id: "67f7647c197ac559e4089b96",
    hotel: hotelsData[0],
    roomType: "Deluxe Suite",
    pricePerNight: 450,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: ["Ocean View", "Balcony", "Mini Bar", "Room Service"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:26:04.013Z",
    updatedAt: "2025-04-10T06:26:04.013Z",
    __v: 0,
  },
  {
    _id: "67f76452197ac559e4089b8e",
    hotel: hotelsData[1],
    roomType: "Executive Room",
    pricePerNight: 350,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: ["City View", "Work Desk", "Premium WiFi", "Concierge Service"],
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:25:22.593Z",
    updatedAt: "2025-04-10T06:25:22.593Z",
    __v: 0,
  },
  {
    _id: "67f76406197ac559e4089b82",
    hotel: hotelsData[2],
    roomType: "Standard Double",
    pricePerNight: 280,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: ["Mountain View", "Free WiFi", "Breakfast Included", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:24:06.285Z",
    updatedAt: "2025-04-10T06:24:06.285Z",
    __v: 0,
  },
  {
    _id: "67f763d8197ac559e4089b7a",
    hotel: hotelsData[3],
    roomType: "Premium Single",
    pricePerNight: 220,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: ["Garden View", "Smart TV", "Room Service", "Spa Access"],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:23:20.252Z",
    updatedAt: "2025-04-10T06:23:20.252Z",
    __v: 0,
  },
  {
    _id: "67f763a1197ac559e4089b72",
    hotel: hotelsData[4],
    roomType: "Family Suite",
    pricePerNight: 380,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: ["Pool Access", "Kitchen", "Living Area", "Free Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559508551-44bff1de756b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&h=300&fit=crop",
    ],
    isAvailable: false,
    createdAt: "2025-04-10T06:22:25.185Z",
    updatedAt: "2025-04-10T06:22:25.185Z",
    __v: 0,
  },
  {
    _id: "67f76385197ac559e4089b6a",
    hotel: hotelsData[5],
    roomType: "Penthouse Suite",
    pricePerNight: 650,
    description:
      "Experience luxury at its finest in our Deluxe Suite. This spacious room features premium amenities, stunning ocean views, and elegant furnishing designed for the discerning traveler. Perfect for couples seeking a romantic getaway or business travelers who appreciate comfort and style.",
    amenities: [
      "Panoramic View",
      "Private Terrace",
      "Butler Service",
      "Jacuzzi",
    ],
    images: [
      "https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:21:57.442Z",
    updatedAt: "2025-04-10T06:21:57.442Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c01",
    hotel: hotelsData,
    roomType: "Oceanfront Villa Suite",
    pricePerNight: 520,
    description:
      "A serene oceanfront suite with floor-to-ceiling glass, private plunge pool, and tropical landscaping for a tranquil coastal escape.",
    amenities: ["Ocean View", "Private Pool", "King Bed", "Outdoor Lounge"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-10T06:26:04.013Z",
    updatedAt: "2025-04-10T06:26:04.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c02",
    hotel: hotelsData,
    roomType: "Tropical Pool Villa",
    pricePerNight: 610,
    description:
      "Lush garden villa centered around a turquoise pool, ideal for private sunbathing and evening dips under palm silhouettes.",
    amenities: [
      "Private Pool",
      "Sun Loungers",
      "Rain Shower",
      "Butler on Call",
    ],
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501117716987-c8e2a8e3f77a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-11T08:10:21.013Z",
    updatedAt: "2025-04-11T08:10:21.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c03",
    hotel: hotelsData,
    roomType: "Modern Beach Villa",
    pricePerNight: 680,
    description:
      "Clean-lined beachfront villa with infinity-edge pool and minimalist interiors that blur the line between indoor and outdoor living.",
    amenities: ["Beach Access", "Infinity Pool", "Smart TV", "Outdoor Shower"],
    images: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512914890250-2640fbd4c4f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=400&h=300&fit=crop",
    ],
    isAvailable: false,
    createdAt: "2025-04-12T10:40:10.013Z",
    updatedAt: "2025-05-02T12:05:37.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c04",
    hotel: hotelsData,
    roomType: "Hillside Chalet Villa",
    pricePerNight: 390,
    description:
      "Cozy timber-accented villa inspired by alpine chalets with panoramic mountain views and a warm, cabin-like ambiance.",
    amenities: ["Mountain View", "Fireplace", "Heated Floors", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1529511582893-2d7e684dd128?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-13T07:26:04.013Z",
    updatedAt: "2025-04-13T07:26:04.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c05",
    hotel: hotelsData,
    roomType: "Lagoon View Pavilion",
    pricePerNight: 455,
    description:
      "Contemporary pavilion overlooking a calm blue lagoon with shaded deck seating and breezy interiors for relaxed coastal living.",
    amenities: [
      "Lagoon View",
      "Deck Seating",
      "Ceiling Fans",
      "Espresso Maker",
    ],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501117716987-c8e2a8e3f77a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-14T05:14:44.013Z",
    updatedAt: "2025-04-14T05:14:44.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c06",
    hotel: hotelsData,
    roomType: "Desert Garden Villa",
    pricePerNight: 430,
    description:
      "Palm-lined courtyard villa with cool stone floors and airy spaces, perfect for golden-hour sunsets and starry nights.",
    amenities: ["Courtyard", "Outdoor Dining", "King Bed", "Walk-in Closet"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1459535653751-d571815e906b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?w=400&h=300&fit=crop",
    ],
    isAvailable: false,
    createdAt: "2025-04-15T09:02:11.013Z",
    updatedAt: "2025-05-01T09:40:22.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c07",
    hotel: hotelsData,
    roomType: "Cliffside Infinity Villa",
    pricePerNight: 735,
    description:
      "Drama-filled cliffside perch with an infinity pool pouring into the horizon and glass balustrades for uninterrupted seascapes.",
    amenities: [
      "Infinity Pool",
      "Sun Deck",
      "Glass Railing",
      "Ambient Lighting",
    ],
    images: [
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512914890250-2640fbd4c4f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-16T11:56:37.013Z",
    updatedAt: "2025-04-16T11:56:37.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c08",
    hotel: hotelsData,
    roomType: "Bali-Style Garden Villa",
    pricePerNight: 480,
    description:
      "Tropical villa framed by greenery, wooden accents, and a private plunge pool for immersive, nature-forward stays.",
    amenities: ["Garden View", "Plunge Pool", "Outdoor Bath", "Canopy Bed"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-17T06:20:19.013Z",
    updatedAt: "2025-04-17T06:20:19.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c09",
    hotel: hotelsData,
    roomType: "Swiss Chalet Grande",
    pricePerNight: 510,
    description:
      "Spacious chalet-inspired villa with timber beams, wraparound balcony, and views of snow-capped ridgelines.",
    amenities: ["Fireplace", "Sauna Access", "Balcony", "Heated Towel Rack"],
    images: [
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1529511582893-2d7e684dd128?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    ],
    isAvailable: false,
    createdAt: "2025-04-18T13:33:51.013Z",
    updatedAt: "2025-05-05T10:02:07.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c0a",
    hotel: hotelsData,
    roomType: "Dubai Marina Villa",
    pricePerNight: 820,
    description:
      "Sleek marina-front villa featuring crisp architecture, outdoor lounge zones, and fast access to dining promenades.",
    amenities: ["Marina View", "Terrace", "Chef’s Kitchen", "Smart Home"],
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1459535653751-d571815e906b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-19T15:49:30.013Z",
    updatedAt: "2025-04-19T15:49:30.013Z",
    __v: 0,
  },
  {
    _id: "67f7647c197ac559e4089c0b",
    hotel: hotelsData,
    roomType: "Jungle Canopy Villa",
    pricePerNight: 575,
    description:
      "Elevated villa immersed in greenery with teak decking, outdoor soaking tub, and birdsong mornings.",
    amenities: ["Forest View", "Outdoor Tub", "Hammock", "Yoga Mats"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501117716987-c8e2a8e3f77a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop",
    ],
    isAvailable: true,
    createdAt: "2025-04-20T08:12:22.013Z",
    updatedAt: "2025-04-20T08:12:22.013Z",
    __v: 0,
  },
];

export const bookingData = [
  {
    _id: "67f76839994a731e97d3b8ce",

    room: roomsData[1],
    hotel: hotelsData[1],
    checkInDate: "2025-04-30T00:00:00.000Z",
    checkOutDate: "2025-05-01T00:00:00.000Z",
    totalPrice: 350,
    guests: 2,
    status: "confirmed",
    paymentMethod: "Stripe",
    isPaid: true,
    createdAt: "2025-04-10T06:42:01.529Z",
    updatedAt: "2025-04-10T06:43:54.520Z",
    __v: 0,
  },
  {
    _id: "67f76829994a731e97d3b8c3",

    room: roomsData[0],
    hotel: hotelsData[0],
    checkInDate: "2025-04-27T00:00:00.000Z",
    checkOutDate: "2025-04-28T00:00:00.000Z",
    totalPrice: 450,
    guests: 1,
    status: "pending",
    paymentMethod: "Pay At Hotel",
    isPaid: false,
    createdAt: "2025-04-10T06:41:45.873Z",
    updatedAt: "2025-04-10T06:41:45.873Z",
    __v: 0,
  },
  {
    _id: "67f76810994a731e97d3b8b4",

    room: roomsData[2],
    hotel: hotelsData[2],
    checkInDate: "2025-04-11T00:00:00.000Z",
    checkOutDate: "2025-04-12T00:00:00.000Z",
    totalPrice: 280,
    guests: 1,
    status: "cancelled",
    paymentMethod: "Pay At Hotel",
    isPaid: false,
    createdAt: "2025-04-10T06:41:20.501Z",
    updatedAt: "2025-04-10T06:41:20.501Z",
    __v: 0,
  },
];
