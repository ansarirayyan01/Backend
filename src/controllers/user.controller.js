import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// import bcrypt from "bcrypt"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // check the validation - not empty
    // check if user already exists: username and email
    // checkfor images , check for avatar
    // upload them to cloudinary , avatar
    // create user object , create them in db
    // remove password and refreah token field from response
    // check for user creation 
    // send response


    const {fullName, username, email, password} = req.body
    // console.log("email: ", email,);
    // console.log(req.body);
    
    if (
        [email, password, fullName, username].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are Required")
    }

    // check if user already exists: username and email
    const userExisted = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })
    if ( userExisted) {
        throw new ApiError(400, "User already exists")
    }

    //check for images , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is compulsory")
    }
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log(req.files);

    // upload them to cloudinary , avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "User already exists")
    }

    // create user object , create them in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    //remove password and refreah token field from response
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!userCreated) {
        throw new ApiError(500, "Something went Wrong while registering user")
    }

    return res.send(201).json(
        new ApiResponse(200, userCreated, "user Registered Successfully!!!")
    )
})

export {registerUser}