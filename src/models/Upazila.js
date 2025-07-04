import mongoose from "mongoose";

const upazilaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  district_id: { type: String, required: true },
  name: { type: String, required: true },
  bn_name: { type: String, required: true },
  url: { type: String },
});

upazilaSchema.index({ id: 1, district_id: 1 }, { unique: true });

export default mongoose.model("Upazila", upazilaSchema, "geo_upazilas");
