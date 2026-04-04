import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "Name must be at least 3 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
    },

    phone: {
        type: String
    },

    accountVerified: {
        type: Boolean,
        default: false
    },

    verificationCode: Number,
    verificationCodeExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
    }
}


export const User = mongoose.model("User", userSchema);




