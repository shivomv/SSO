const mongoose = require('mongoose');
const validator = require('validator');

const applicationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Application Name"],
        maxLength: [50, "Application Name cannot exceed 50 characters"],
        minLength: [3, "Application Name should have more than 3 characters"]
    },
    icon: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    url: {
        type: String,
        required: [true, "Please Enter Application URL"],
        validate: {
            validator: function(value) {
                // Check if the value is a valid URL (can be IP or domain)
                return validator.isURL(value, { require_protocol: true });
            },
            message: "Please Enter a valid URL or IP address"
        }
    }
});




module.exports = mongoose.model('Application', applicationsSchema);
