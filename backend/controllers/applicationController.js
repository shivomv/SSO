const Application = require('../models/applicationsModel');
const User = require("../models/userModel")
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors'); // For async error handling

// Create new application (Admin only)
exports.createApplication = catchAsyncErrors(async (req, res, next) => {
    const { name, icon, url } = req.body;

    const application = await Application.create({
        name,
        icon,
        url
    });

    res.status(201).json({
        success: true,
        data: application
    });
});

// Update application (Admin only)
exports.updateApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    let application = await Application.findById(id);

    if (!application) {
        return next(new ErrorHandler(`Application not found with id of ${id}`, 404));
    }

    // Update the application data
    application = await Application.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        data: application
    });
});

// Delete application (Admin only)
exports.deleteApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
        return next(new ErrorHandler(`Application not found with id of ${id}`, 404));
    }

    await application.remove();

    res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
    });
});

// Get all applications
exports.getAllApplications = catchAsyncErrors(async (req, res, next) => {
    const applications = await Application.find();

    res.status(200).json({
        success: true,
        data: applications
    });
});

// Get a single application by ID
exports.getApplicationById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
        return next(new ErrorHandler(`Application not found with id of ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: application
    });
});



// Add application to user (userId)
exports.addApplicationToUser = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;
    const { url } = req.body; // Only providing the application's URL

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler(`User not found with id of ${userId}`, 404));
    }

    // Find the application by URL
    const application = await Application.findOne({ url });
    if (!application) {
        return next(new ErrorHandler(`No application found with the URL ${url}`, 404));
    }

    // Check if the application is already associated with the user (optional)
    if (user.applications.includes(application._id)) {
        return next(new ErrorHandler('This application is already added to the user.', 400));
    }

    // Add the application's _id to the user's applications array
    user.applications.push(application._id);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Application added successfully to the user",
        data: application
    });
});


// Get all applications by userId
exports.getApplicationsByUserId = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;

    // Fetch user by userId and populate applications
    const user = await User.findById(userId).populate('applications');

    if (!user) {
        return next(new ErrorHandler(`User not found with id of ${userId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user.applications // Return applications associated with the user
    });
});