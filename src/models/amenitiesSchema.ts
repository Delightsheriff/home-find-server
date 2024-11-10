import { Schema } from "mongoose";
import { IAmenities } from "../common/interfaces/property";

export const amenitiesSchema = new Schema<IAmenities>({
  furnished: { type: Boolean, default: false, required: true },
  parking: { type: Boolean, default: false, required: true },
  gym: { type: Boolean, default: false, required: true },
  swimmingPool: { type: Boolean, default: false, required: true },
  internet: { type: Boolean, default: false, required: true },
  balcony: { type: Boolean, default: false, required: true },
  elevator: { type: Boolean, default: false, required: true },
  wheelchair: { type: Boolean, default: false, required: true },
  dishwasher: { type: Boolean, default: false, required: true },
  petsAllowed: { type: Boolean, default: false, required: true },
  smokingAllowed: { type: Boolean, default: false, required: true },
  fireplace: { type: Boolean, default: false, required: true },
  cableTv: { type: Boolean, default: false, required: true },
  airConditioning: { type: Boolean, default: false, required: true },
  heating: { type: Boolean, default: false, required: true },
  securitySystem: { type: Boolean, default: false, required: true },
  cctv: { type: Boolean, default: false, required: true },
  churchNearby: { type: Boolean, default: false, required: true },
  mosqueNearby: { type: Boolean, default: false, required: true },
});
