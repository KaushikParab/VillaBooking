import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";


// add a new Room
export const addRoom = async (req, res) => {
  try {
    const {
      roomType,
      villa,
      pricePerNight,
      description,
      amenities,
      isAvailable,
    } = req.body;
    const image = req.files?.map((file) => file.filename);
    const newRoom = await Room.create({
      roomType,
      villa,
      pricePerNight,
      description,
      amenities,
      isAvailable,
      images: image,
    });
    return res
      .status(201)
      .json({ message: "Room added successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all rooms for a specific owner
export const getOwnerRooms = async (req, res) => {
  try {
    const { id } = req.user;

    const rooms = await Room.find()
      .populate({
        path: "villa",
        select: "villaName villaAddress rating amenities owner",
      });

    const ownerRooms = rooms.filter(
      (room) => room.villa && room.villa.owner.toString() === id
    );

    return res.status(200).json({
      success: true,
      rooms: ownerRooms,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get all rooms for USers
export const getAllRooms = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;

    const totalRooms = await Room.countDocuments();

    const rooms = await Room.find()
      .populate({
        path: "villa",
        select: "villaName villaAddress amenities rating owner",
        populate: { path: "owner", select: "name email" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      rooms,
      pagination: {
        hasMore: page * limit < totalRooms,
        currentPage: Number(page),
        totalRooms,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ================= MOST POPULAR ROOMS =================
export const getPopularRooms = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const popularRooms = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: "cancelled" },
          room: { $ne: null }, // only room bookings
        },
      },
      {
        $group: {
          _id: "$room",
          totalBookings: { $sum: 1 },
          lastBookingAt: { $max: "$createdAt" },
        },
      },
      {
        $sort: {
          totalBookings: -1,
          lastBookingAt: -1,
        },
      },
      { $limit: 4 },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $lookup: {
          from: "villas",
          localField: "room.villa",
          foreignField: "_id",
          as: "villa",
        },
      },
      { $unwind: "$villa" },
    ]);

    res.status(200).json({
      success: true,
      rooms: popularRooms.map((r) => ({
        ...r.room,
        villa: r.villa,
        totalBookings: r.totalBookings,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular rooms",
    });
  }
};