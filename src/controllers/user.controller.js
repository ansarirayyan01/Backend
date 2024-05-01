import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; 
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// import bcrypt from "bcrypt"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefereshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await generateAccessToken()
        const refreshToken = await generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return(accessToken, refreshToken)

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

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


const loginUser = asyncHandler(async () => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // generate refresh token
    // generate access token
    // send cookies
    // send response

    const {fullName, username, email} = req.body
    if(!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })
    if (!user) {
        throw new ApiError(400, "User does not exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect")
    }

    const {generateAccessToken, generateRefreshToken} = await generateAccessAndRefereshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully!!!"
        )
    )

    
})

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged Out Successfully!!!"
        )
    )
})

export {registerUser, loginUser, logoutUser}