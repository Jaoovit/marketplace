const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const {
      username,
      name,
      password,
      confPassword,
      email,
      phoneNumber,
      profession,
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
        phoneNumber,
        profession,
        description,
        profileImage,
      },
    });
    res
      .status(200)
      .json({ message: "user created sucessfully", user: newUser });
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.session.userInfo = req.user;

      return res.status(200).json({ message: "Login sucessfully" });
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
      return res.status(200).json({ message: "logout sucessfully" });
    });
  });
};

module.exports = { registerUser, loginUser, logoutUser };
