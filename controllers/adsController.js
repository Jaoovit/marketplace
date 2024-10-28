const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllAds = async (req, res) => {
  try {
    const advertisements = await prisma.ads.findMany();
    res.status(200).json({
      message: "Advertisements gotted sucessfully",
      advertisements: advertisements,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error getting advertisements");
  }
};

module.exports = { getAllAds };
