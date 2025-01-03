import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "error in getprofile" });

    res.status(200).json(user );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById({ _id: id });
    const currentUser = await User.findById({ _id: req.user._id }); // since the portected route will make the req as the  the user who is loggined

    if (!userToModify || !currentUser) {
      return res.status(404).json({ message: "user not found" });
    }

    if (id === req.user._id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isFollwing = currentUser.following.includes(id); // it will check the following array of a current user if he follows

    if (isFollwing) {
      //dounfollow
      //await User.findByIdAndUpdate({_id : })
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: req.user._id } }
      );
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { following: id } }
      );
      res.status(200).json({ message: "unfollow successfully" });

      //! this is to send notification
      const newNotification = new Notification({
        type: "unfollow",
        from: id,
        to: req.user._id,
      });
      await newNotification.save();
    } else {
      //dofollow
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: req.user._id } }
      ); // to put my id in the follower id array
      //{_id : id} means it will get the json of the onw with id here it is the usertoModefied
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { following: id } }
      ); // to put that id ih my following array
      // {_id :req.user._id} this will take the json obj here which is the current user

      //! this is to send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });

      await newNotification.save();

      res.status(200).json({ message: "follow successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "error in followUnfollowUser" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById({ _id: userId }).select(
      "-password"
    );
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } }, // gets all the users id without the current user id
      },
      {
        $sample: {
          // from the selected ids select only 10 users id randomly
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    // it takes 10 users 1 by one and and search inside userfollowedbyme in that inside the folowing array it if the user is not followed it will be in filteredUsers
    const suggestedUsers = filteredUsers.slice(0, 4); // select first 4 objects

    suggestedUsers.forEach((user) => (user.password = null));
    //for security reasons the suggestedUsers password is set to nul in this array cuz we dont need password here
    res.status(200).json({ suggestedUsers });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "error in getSuggestedUsers" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    let { username, fullname, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handling profile image upload
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    // Handling cover image upload
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);  // Corrected to upload cover image
      coverImg = uploadedResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.coverImg = coverImg || user.coverImg;
    user.profileImg = profileImg || user.profileImg;

    user = await user.save();
    user.password = null; // Do not return password to the client

    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error in updateUser" });
  }
};

