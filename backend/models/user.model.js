import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        mobile: { type: String, required: true },
        role: { type: String, enum: ['user', 'owner', 'shipper'], required: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;