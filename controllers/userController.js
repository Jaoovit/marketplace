const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

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
      profileImage,
    } = req.body;

    if (password !== confPassword) {
      throw new Error("Password must match password confirmation");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        name,
        phone,
        profession,
        location,
        description,
        profileImage,
      },
    });
    res
      .status(200)
      .json({ message: "user created sucessfully", user: newUser });
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

const updateDescription = async (req, res) => {
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

const updateProfileImage = async (req, res) => {
  try {
    const { newProfileImage } = req.body;
    const userId = req.session.passport.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }
    if (!newProfileImage) {
      return res.status(400).json({ message: "New profile image is required" });
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
        profileImage: newProfileImage,
      },
    });

    return res.status(200).json({
      message: "Profile image updated sucessfully",
      updatedProfileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).send("Error updating profile image");
  }
};

const updateLocation = async (req, res) => {
  try {
    const { newLocation } = req.body;
    const userId = req.session.passport.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }

    if (!newLocation) {
      return res.status(400).json({ message: "New location is required" });
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
  updateDescription,
  updateProfileImage,
  updateLocation,
};
