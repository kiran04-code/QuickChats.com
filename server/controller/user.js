import User from "../model/user.js"
import { createToken } from "../Auth/jwt.js"
import bcrypt from "bcryptjs"
import cloudinary from "../config/claoudinary.js"

export async function createUser(req, res) {
    const { email, fullName, password, bio } = req.body
    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ sucess: false, message: "Missing Details" })
        }

        const findUser = await User.findOne({ email })

        if (findUser) {
            return res.status(409).json({ sucess: false, message: "User already exists" });
        } else {

            const hashpass = await bcrypt.hash(password, 10)
            const data = await User.create({
                fullName,
                email,
                password: hashpass,
                bio,

            })

            const token = await createToken(data); // ✅ await is necessary here
            res.cookie("access_Token", token).status(200).json({
                sucess: true,
                message: "Account Created successfully",
                userData: data,
            })
        }

    } catch (error) {

        console.log(error)
        res.json({
            sucess: false,
            message: "Isuue not Account not Creted"

        })
    }
}

export async function Login(req, res) {
    const { email, password } = req.body
    try {
        const existedUser = await User.findOne({ email })
        if (!existedUser) {
            return res.json({
                sucess: false,
                message: "User does Not Exist"
            })
        }
        const existedUserHashedPassword = existedUser.password;
        const passwordMatches = await bcrypt.compare(password, existedUserHashedPassword);
        if (!passwordMatches) {
            return res.json({
                sucess: false,
                message: "invalid Password!",

            })
        }
        const token = createToken(existedUser)
        res.cookie("access_Token", token).json({
            sucess: true,
            message: "Login SucessFully",
            userData: existedUser
        })
    } catch (error) {
        res.json({
            sucess: false,
            message: "Issue to Login The User",

        })
    }
}

// Controller for User Profile Details

export const UpdateProfile = async (req, res) => {
    try {
        const { fullName, bio, ProfilePic } = req.body;

        const userid = req.user._id;
        let updateUser;

        if (!ProfilePic) {
            updateUser = await User.findByIdAndUpdate(
                userid,
                { fullName, bio },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(ProfilePic)
            updateUser = await User.findByIdAndUpdate(
                userid,
                { ProfilePic: upload.secure_url, bio, fullName },
                { new: true }
            );
        }

        res.json({
            success: true,
            user: updateUser,
            message: "Profile Updated Successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const Logout = (req, res) => {
  res.clearCookie("access_Token", {
    httpOnly: true,
    secure: false, // set to true if HTTPS
    sameSite: "Lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
