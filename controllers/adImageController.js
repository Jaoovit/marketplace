const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");

const deleteImageById = async (req, res) => {
  const userId = req.session.passport?.user;

  if (!userId) {
    return res.status(400).json({ message: `User ID ${userId} not found` });
  }
  const imageId = parseInt(req.params.id, 10);

  if (isNaN(imageId)) {
    return res.status(400).json({ message: "Invalid image id" });
  }
  try {
    const image = await prisma.adImage.findUnique({
      where: {
        id: imageId,
      },
      include: {
        ad: {
          select: { userId: true },
        },
      },
    });

    if (!image) {
      return res.status(404).json({ message: `Image ${imageId} not found` });
    }

    if (image.ad.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this image" });
    }

    await prisma.adImage.delete({
      where: {
        id: imageId,
      },
    });
    return res
      .status(200)
      .json({ message: `Image ${imageId} deleted sucessfully` });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error deleting image ${imageId}` });
  }
};

module.exports = { deleteImageById };
