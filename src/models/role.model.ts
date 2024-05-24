import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
  permission_key: { type: String, required: true },
  permission_value: { type: [Number], required: true },
});

const adminRoleSchema = new Schema(
  {
    roleName: { type: String, required: true, unique: true },
    description: { type: String, required: true, default: "This admin role" },
    permissions: { type: [permissionSchema], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const AdminRole = mongoose.model("Adminrole", adminRoleSchema);

export default AdminRole;
