const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const {
      username,
      name,
      password,
      confPassword,
      email,
      phone,
      profession,
      location,
      description,
    } = req.body;

    if (!username || !name || !password || !confPassword || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confPassword) {
      return res
        .status(400)
        .json({ message: "Password must match password confirmation" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImageUrl = null;

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res
          .status(400)
          .json({ message: "Failed to upload image", error: cloudinaryError });
      }
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        phone,
        profession,
        location,
        description,
        profileImage: profileImageUrl,
      },
    });

    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error registering user");
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed", message: info.message });
    }
    req.logIn(user, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Login failed, please try again" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profession: user.profession,
          location: user.location,
          description: user.description,
          profileImage: user.profileImage,
        },
      });
    });
  })(req, res, next);
};

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout sucessfully" });
    });
  });
};

const updateUserDescription = async (req, res) => {
  try {
    const { newDescription } = req.body;
    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }
    if (!newDescription) {
      return res.status(400).json({ message: "New description is required" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        description: newDescription,
      },
    });

    return res.status(200).json({
      message: "Description updated successfully",
      updatedDescription: updatedUser.description,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error updating description");
  }
};

const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "New profile image is required" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileImageUrl = null;

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      profileImageUrl = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return res
        .status(400)
        .json({ message: "Failed to upload image", error: cloudinaryError });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: profileImageUrl,
      },
    });

    return res.status(200).json({
      message: "Profile image updated successfully",
      updatedProfileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error updating profile image");
  }
};

const updateUserLocation = async (req, res) => {
  try {
    const { newLocation } = req.body;

    if (!newLocation) {
      return res.status(400).json({ message: "New location is required" });
    }

    const userId = req.session.passport?.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        location: newLocation,
      },
    });
    res.status(200).json({
      message: "Location updated sucessfully",
      updatedLocation: updateUser.location,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error updating location");
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUserDescription,
  updateUserProfileImage,
  updateUserLocation,
};
