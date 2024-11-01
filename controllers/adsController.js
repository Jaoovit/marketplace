const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");

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
      return res.status(400).send({ message: "User ID not found" });
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

const postAd = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    let imageUrls = [];
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          })
          .end(image.buffer);
      });
    });

    imageUrls = await Promise.all(uploadPromises);

    const newAdvertisement = await prisma.ads.create({
      data: {
        title: title,
        description: description,
        userId: userId,
        images: {
          create: imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
    });

    const createdAdWithImages = await prisma.ads.findUnique({
      where: { id: newAdvertisement.id },
      include: { images: true },
    });

    return res.status(200).json({
      message: "Advertisement created successfully",
      newAdvertisement: createdAdWithImages,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: "Error creating advertisement" });
  }
};

const updateAdTitle = async (req, res) => {
  const adId = parseInt(req.params.id, 10);

  if (!adId) {
    return res
      .status(400)
      .json({ message: `Advertisement ID ${adId} not found` });
  }

  try {
    const { newTitle } = req.body;

    if (!newTitle) {
      return res.status(400).json({ message: "New title is required" });
    }

    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedAd = await prisma.ads.update({
      where: {
        id: adId,
        userId: userId,
      },
      data: {
        title: newTitle,
      },
    });

    return res.status(200).json({
      message: `Advertisement ${adId} title updated sucessfully`,
      updatedLocation: updatedAd.title,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ message: `Error updating advertisement ${adId} title` });
  }
};

const updateAdDescription = async (req, res) => {
  const adId = parseInt(req.params.id, 10);

  if (!adId) {
    return res
      .status(400)
      .json({ message: `Advertisement ID ${adId} not found` });
  }

  try {
    const { newDescription } = req.body;

    if (!newDescription) {
      return res.status(400).json({ message: "New description is required" });
    }

    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedAd = await prisma.ads.update({
      where: {
        id: adId,
        userId: userId,
      },
      data: {
        description: newDescription,
      },
    });

    return res.status(200).json({
      message: `Advertisement ${adId} description updated sucessfully`,
      updatedLocation: updatedAd.description,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ message: `Error updating advertisement ${adId} description` });
  }
};

const deleteAdById = async (req, res) => {
  const adId = parseInt(req.params.id);

  if (!adId) {
    return res
      .status(400)
      .json({ message: `Advertisement ID ${adId} not found` });
  }

  try {
    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.adImage.deleteMany({
        where: {
          adId: adId,
        },
      });

      await prisma.ads.delete({
        where: {
          id: adId,
          userId: userId,
        },
      });
    });
    return res
      .status(200)
      .json({ message: `Advertisement ${adId} deleted sucessfully` });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ message: `Error deleting advertisement ${adId}` });
  }
};

const deleteAdByUser = async (req, res) => {
  const userId = req.session.passport?.user;

  if (!userId) {
    return res.status(400).json({ message: `User ID ${userId} not found` });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      const ads = await prisma.ads.findMany({
        where: { userId: userId },
        select: { id: true },
      });

      const adIds = ads.map((ad) => ad.id);

      if (adIds.length > 0) {
        await prisma.adImage.deleteMany({
          where: {
            adId: { in: adIds },
          },
        });

        await prisma.ads.deleteMany({
          where: {
            id: { in: adIds },
          },
        });
      }
    });
    res
      .status(200)
      .json({ message: `Advertisements deleted for user ${userId}` });
  } catch (error) {
    console.error("Error details", error);
    return res
      .status(500)
      .json({ message: `Error deleting advertisement by user ${userId}` });
  }
};

module.exports = {
  getAllAds,
  getAdById,
  getAdsByUser,
  searchAds,
  postAd,
  updateAdTitle,
  updateAdDescription,
  deleteAdById,
  deleteAdByUser,
};
