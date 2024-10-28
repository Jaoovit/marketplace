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
    return res.status(500).send("Error getting advertisements");
  }
};

const getAdById = async (req, res) => {
  const adId = parseInt(req.params.id, 10);
  try {
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
    return res.status(500).send(`Error getting advertisement ${adId}`);
  }
};

const getAdsByUser = async (req, res) => {
  const userId = req.session.passport?.user;
  try {
    if (!userId) {
      return res.status(400).send({ message: "User ID not found in session" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const advertisements = await prisma.ads.findMany({
      where: { userId: userId },
    });
    return res.status(200).json({
      message: `User ${userId}'s advertisements gotted sucessfully`,
      advertisements: advertisements,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).send("Error getting advertisements by user");
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
    return res.status(500).send("Error searching advertisements");
  }
};

module.exports = { getAllAds, getAdById, getAdsByUser, searchAds };
