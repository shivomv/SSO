const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar: {
            public_id: "this is a sample id",
            url: "profile pic url"
        }
    });

    sendToken(user, 201, res)
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res)
});

exports.logout = catchAsyncErrors(
    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
)

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is: \n${resetPasswordUrl}\nIf you have not requested this, then ignore this email and continue to use our services.`;
    try {
        // Fix: Use user.email instead of undefined email variable
        const result = await sendEmail(user.email, "Password Reset Request", message);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler("Invalid token", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res); 
})

// Change password
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// Logged in user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
})

// Get single user (admin)
exports.getUserDetailsAdmin = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
})


// Update user role (admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
        }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        user
    });
})

// Get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
})




