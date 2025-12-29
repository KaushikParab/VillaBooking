import Room from "../models/room.model.js";

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
    const rooms = await Room.find()
      .populate({
        path: "villa",
        select: "villaName villaAddress amenities rating owner",
        populate: { path: "owner", select: "name email" },
      })
      .exec();
    res.json({ success: true, rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Inetrnal server error" });
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
