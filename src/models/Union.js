import mongoose from "mongoose";

const unionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  upazila_id: { type: String, required: true },
  name: { type: String, required: true },
  bn_name: { type: String, required: true },
  url: { type: String },
});

unionSchema.index({ id: 1, upazila_id: 1 }, { unique: true });

export default mongoose.model("Union", unionSchema, "geo_unions");
