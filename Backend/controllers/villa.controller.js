import Villa from "../models/villa.model.js";

//Register a new villa

export const registerVilla = async (req, res) => {
  const { id } = req.user;

  try {
    const { villaName, villaContactNo, villaAddress, rating, price, amenities } = req.body;

    const images = req.files?.map((file) => file.filename);

    if (
      !villaName ||
      !villaContactNo ||
      !villaAddress ||
      !rating ||
      !price ||
      !amenities ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const newVilla = await Villa.create({
      villaName,
      villaContactNo,
      villaAddress,
      rating,
      price,
      amenities,
      images,
      owner: id,
    });

    return res.status(201).json({
      message: "Villa registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get owner villas
export const getOwnerVillas = async (req, res) => {
  const { id } = req.user;
  try {
    const villas = await Villa.find({ owner: id }).populate(
      "owner",
      "name email"
    );
    return res.status(200).json({ villas, success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all villas
export const getAllVillas = async (req, res) => {
  try {
    const villas = await Villa.find().populate("owner", "name email");
    return res.status(200).json({ villas, success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Villa
export const deleteVilla = async (req, res) => {
  const { villaId } = req.params;
  try {
    const deleteVilla = await Villa.findByIdAndDelete(villaId);
    if (!deleteVilla) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    return res
      .status(200)
      .json({ message: "Hotel deleted successfully", success: true });
  } catch (error) {
    return res.status(200).json({ message: "Internal server error" });
  }
};
