const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");

const updateImageById = async (req, res) => {
  const userId = req.session.passport?.user;

  if (!userId) {
    return res.status(400).json({ message: `User ID ${userId} not found` });
  }
  const imageId = parseInt(req.params.id, 10);

  if (isNaN(imageId)) {
    return res.status(400).json({ message: "Invalid image id" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "New image is required" });
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

    let newImage = null;

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      newImage = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res
        .status(400)
        .json({ message: "Failed to upload image", error: cloudinaryError });
    }

    const updatedImage = await prisma.adImage.update({
      where: {
        id: imageId,
      },
      data: {
        imageUrl: newImage,
      },
    });
    return res.status(200).json({
      message: `Image ${imageId} updated successfully`,
      updatedImage: updatedImage.imageUrl,
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ message: `Error updating image ${imageId}` });
  }
};

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

module.exports = { updateImageById, deleteImageById };
