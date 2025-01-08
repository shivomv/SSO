const express = require('express');
const { createApplication, updateApplication, deleteApplication, getAllApplications, getApplicationById, addApplicationToUser, getApplicationsByUserId } = require('../controllers/applicationController');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")
const router = express.Router();


router.route('/aplications')
    .get(getAllApplications)        // Get all applications
router.route('/aplication/new')       // Get all applications
    .post(isAuthenticatedUser, authorizeRoles("user"), createApplication); // Create application (admin only)

router.route('/:id')
    .get(getApplicationById)        // Get application by ID
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateApplication) // Update application (admin only)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteApplication); // Delete application (admin only)

router.route('/user/:userId/application')
    .post(addApplicationToUser)
    .get(isAuthenticatedUser, getApplicationsByUserId);



module.exports = router;
