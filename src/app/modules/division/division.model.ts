import { model, Schema } from "mongoose";
import { IDevision } from "./division.interface";

const divisionSchema = new Schema<IDevision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String }
}, {
    timestamps: true
})

export const Division = model<IDevision>("Division", divisionSchema)