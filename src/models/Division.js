import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bn_name: { type: String, required: true },
  url: { type: String },
});

export default mongoose.model("Division", divisionSchema, "geo_divisions");
