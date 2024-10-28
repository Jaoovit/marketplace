const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllAds = async (req, res) => {
  try {
    const advertisements = await prisma.ads.findMany();
    return res.status(200).json({
      message: "Advertisements gotted sucessfully",
      advertisements: advertisements,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error getting advertisements");
  }
};

const getAdById = async (req, res) => {
  try {
    const adId = parseInt(req.params.id, 10);

    if (isNaN(adId)) {
      return res.status(400).send("Invalid advertisement id");
    }

    const advertisement = await prisma.ads.findUnique({
      where: {
        id: adId,
      },
    });

    if (!advertisement) {
      return res.status(400).json({ message: "Advertisement not found" });
    }

    return res.status(200).json({
      message: `Advertisement ${adId} gotted sucessfully`,
      advertisement: advertisement,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error getting advertisement by Id");
  }
};

const searchAds = async (req, res) => {
  const { query } = req.query;
  try {
    const advertisements = await prisma.ads.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (advertisements.length === 0) {
      return res.status(404).json({
        message: `No advertisements found matching with ${query}.`,
      });
    }

    return res.status(200).json({
      message: `Searching for ${query} sucessfully`,
      advertisements: advertisements,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error searching advertisements");
  }
};

module.exports = { getAllAds, getAdById, searchAds };
