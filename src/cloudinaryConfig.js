import { Cloudinary } from "cloudinary-core";

const cloudinaryCore = new Cloudinary({
  cloud_name: "doboaoxjf",
  secure: true, // Use HTTPS
});

export default cloudinaryCore;
