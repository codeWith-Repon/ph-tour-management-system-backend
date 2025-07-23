import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {

            const originalName = file.originalname.toLowerCase(); //// e.g., "My Special.Image#!@.png"

            // Split the filename into name and extension parts
            const nameParts = originalName.split(".");
            const extension = nameParts.pop(); // Remove and store the last part (e.g., "png")
           
            // Join the remaining parts with dash (e.g., ["my", "special", "image"] => "my-special-image")
            const nameWithoutExtension = nameParts
                .join("-")                          // Join parts with dash
                .replace(/\s+/g, "-")              // Replace spaces with dash
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-]/g, "");      // Remove all non-alphanumeric except dash

            // Generate a unique filename using base36 random string and timestamp
            const randomPart = Math.random().toString(36).substring(2); // random: "x8kasd"
            const timestamp = Date.now();                               // current time in ms
            const uniqueFileName = `${randomPart}-${timestamp}-${nameWithoutExtension}.${extension}`;

            // ✅ Example Output:
            // Input: "My Special.Image#!@.png"
            // Output: "x8kasd-1753278001234-my-special-image.png"

            return uniqueFileName;
        }
    }
})

export const multerUpload = multer({ storage: storage })