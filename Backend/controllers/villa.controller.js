import Villa from "../models/villa.model.js";
import Booking from "../models/booking.model.js";

// ================= REGISTER VILLA =================
export const registerVilla = async (req, res) => {
  const { id } = req.user;

  try {
    const {
      villaName,
      villaContactNo,
      villaAddress,
      rating,
      guests,
      price,
      amenities,
    } = req.body;

    const images = req.files?.map((file) => file.filename);

    if (
      !villaName ||
      !villaContactNo ||
      !villaAddress ||
      rating === undefined ||
      guests === undefined ||
      price === undefined ||
      !amenities ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    await Villa.create({
      villaName,
      villaContactNo,
      villaAddress,
      rating,
      guests,
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

// ================= OWNER VILLAS =================
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

// ================= ALL VILLAS (OPTIMIZED) =================
export const getAllVillas = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      page = 1,
      limit = 6,
      sort = "latest", // priceLow | priceHigh | rating | latest
      location,
      guests,
      checkIn,
      checkOut,
    } = req.query;

    let filter = {};

    //-------- DATE RANGE VALIDATION --------
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      if (isNaN(inDate) || isNaN(outDate) || inDate >= outDate) {
        return res.status(400).json({
          success: false,
          message: "Check-out date must be after check-in date",
        });
      }
    }

    // -------- PRICE FILTER --------
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // -------- LOCATION FILTER --------
    if (location) {
      filter.villaAddress = {
        $regex: location,
        $options: "i", // case-insensitive
      };
    }

    // -------- GUEST FILTER --------
    if (guests) {
      filter.guests = { $gte: Number(guests) };
    }

    /* ---------- DATE AVAILABILITY ---------- */
    if (checkIn && checkOut) {
      const unavailableVillas = await Booking.distinct("villa", {
        status: { $ne: "cancelled" },
        checkIn: { $lte: new Date(checkOut) },
        checkOut: { $gte: new Date(checkIn) },
      });

      filter._id = { $nin: unavailableVillas };
    }

    // -------- SORT --------
    let sortOption = { createdAt: -1 };

    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    // -------- PAGINATION --------
    const skip = (Number(page) - 1) * Number(limit);

    const totalVillas = await Villa.countDocuments(filter);

    const villas = await Villa.find(filter)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      villas,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalVillas / limit),
        totalVillas,
        hasMore: Number(page) * Number(limit) < totalVillas,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= DELETE VILLA =================
export const deleteVilla = async (req, res) => {
  const { villaId } = req.params;

  try {
    const deletedVilla = await Villa.findByIdAndDelete(villaId);

    if (!deletedVilla) {
      return res.status(404).json({ message: "Villa not found" });
    }

    return res.status(200).json({
      message: "Villa deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};



// ================= MOST POPULAR VILLAS =================
export const getPopularVillas = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const popularVillas = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$villa",
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: { totalBookings: -1 },
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: "villas",
          localField: "_id",
          foreignField: "_id",
          as: "villa",
        },
      },
      {
        $unwind: "$villa",
      },
    ]);

    res.status(200).json({
      success: true,
      villas: popularVillas.map((v) => ({
        ...v.villa,
        totalBookings: v.totalBookings,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular villas",
    });
  }
};