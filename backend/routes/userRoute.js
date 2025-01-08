const express = require("express")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, getUserDetailsAdmin, getAllUsers, updateUserRole, changePassword } = require("../controllers/userController")
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout)
router.route("/password/change").put(isAuthenticatedUser, changePassword)

// user routes
router.route("/me").get(isAuthenticatedUser, getUserDetails)

// admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetailsAdmin)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
module.exports = router