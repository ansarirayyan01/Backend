import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
    username: {
        type: 'string',
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 16,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: 'string',
        required: true,
        trim: true,
    },
    avatar:{
        type: 'String', // cloudinary url
        required: true,
    },
    coverImage:{
        type: 'String', // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: 'String',
        required: [true, 'Password is required'],
        minlength: 8,
        maxlength: 16,
    },
    refreshToken: {
        type: "String"
    }
    }
, {timestamps: true})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(accessToken){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(refreshToken){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)