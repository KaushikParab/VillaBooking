import Villa from "../models/villa.model.js";
import Booking from "../models/booking.model.js";
import AvailabilityBlock from "../models/availabilityBlock.model.js";

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
      totalRooms,
      meals,
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

    const mealsData = meals ? JSON.parse(meals) : {};
    await Villa.create({
      villaName,
      villaContactNo,
      villaAddress,
      rating,
      guests,
      price,
      amenities,
      totalRooms,
      meals: mealsData,
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
      "name email",
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
      sort = "latest",
      location,
      adults = 0,
      children = 0,
      infants = 0,
      checkIn,
      checkOut,
      rating,
      bedrooms,
      amenities,
      city,
      meals,
    } = req.query;

    const totalGuests = Number(adults) + Number(children) + Number(infants);

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
        $regex: new RegExp(location.trim(), "i"),
      };
    }

    // -------- GUEST FILTER --------
    if (totalGuests > 0) {
      filter.guests = { $gte: totalGuests };
    }

    /* ---------- DATE AVAILABILITY ---------- */
    if (checkIn && checkOut) {
      // BOOKED VILLAS
      const bookedVillas = await Booking.distinct("villa", {
        status: { $ne: "cancelled" },
        checkIn: { $lte: new Date(checkOut) },
        checkOut: { $gte: new Date(checkIn) },
      });

      // MANUALLY BLOCKED VILLAS
      const blockedVillas = await AvailabilityBlock.distinct("villa", {
        checkIn: { $lte: new Date(checkOut) },
        checkOut: { $gte: new Date(checkIn) },
      });

      // MERGE BOTH
      const unavailableVillas = [
        ...new Set([...bookedVillas, ...blockedVillas]),
      ];

      filter._id = { $nin: unavailableVillas };
    }

    // RATING
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // BEDROOM FILTER
    if (bedrooms) {
      filter.totalRooms = { $gte: Number(bedrooms) };
    }

    // CITY
    if (city) {
      filter.villaAddress = {
        $regex: new RegExp(city, "i"),
      };
    }

    // COMBINED FILTERS
    let andConditions = [];

    // AMENITIES
    if (amenities) {
      const amenitiesArray = amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      amenitiesArray.forEach((amenity) => {
        andConditions.push({
          amenities: { $regex: new RegExp(`\\b${amenity}\\b`, "i") },
        });
      });
    }

    // MEALS FILTER
    if (meals) {
      const mealsArray = meals
        .split(",")
        .map((m) => m.trim().toLowerCase())
        .filter(Boolean);

      mealsArray.forEach((meal) => {
        filter[`meals.${meal}`] = true;
      });
    }

    // APPLY
    if (andConditions.length > 0) {
      filter.$and = andConditions;
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
      .limit(Number(limit))
      .lean();

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

// ================= GET SINGLE VILLA =================
export const getSingleVilla = async (req, res) => {
  try {
    const { id } = req.params;

    const villa = await Villa.findById(id)
      .populate("owner", "name email")
      .lean();

    if (!villa) {
      return res.status(404).json({
        success: false,
        message: "Villa not found",
      });
    }

    res.status(200).json({
      success: true,
      villa,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
