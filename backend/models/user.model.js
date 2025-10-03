import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        mobile: { type: String, required: true },
        role: { type: String, enum: ['user', 'owner', 'shipper'], required: true },
        resetPasswordOtp: { type: String },
        isOtpVerified: { type: Boolean, default: false },
        otpExpiry: { type: Date },
        location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
    },
    { timestamps: true }
);

UserSchema.index({ location: "2dsphere" }); // Geospatial index for location field

const User = mongoose.model("User", UserSchema);
export default User;