import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  division_id: { type: String, required: true },
  name: { type: String, required: true },
  bn_name: { type: String, required: true },
  lat: { type: String },
  lon: { type: String },
  url: { type: String },
});

districtSchema.index({ id: 1, division_id: 1 }, { unique: true });

export default mongoose.model("District", districtSchema, "geo_districts");
