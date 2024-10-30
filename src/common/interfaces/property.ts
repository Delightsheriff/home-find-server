import { Types } from "mongoose";
import {
  CommercialSubType,
  IndustrialSubType,
  LandSubType,
  PropertyType,
  Purpose,
  ResidentialSubType,
  VerificationStatus,
} from "../constants";

export interface IAmenities {
  furnished: boolean;
  parking: boolean;
  gym: boolean;
  swimmingPool: boolean;
  internet: boolean;
  balcony: boolean;
  elevator: boolean;
  wheelchair: boolean;
  dishwasher: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  fireplace: boolean;
  cableTv: boolean;
  airConditioning: boolean;
  heating: boolean;
  securitySystem: boolean;
  cctv: boolean;
  churchNearby: boolean;
  mosqueNearby: boolean;
  security: boolean;
  waterSupply: boolean;
  electricity: boolean;
}

export interface IProperty {
  owner: Types.ObjectId;
  title: string;
  purpose: Purpose;
  amenities: IAmenities;
  slots: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  address: string;
  stateCapital: string;
  localGovernment: string;
  isVerified: boolean;
  size: number;
  toilets: number;
  propertyType: PropertyType;
  subType:
    | ResidentialSubType
    | CommercialSubType
    | IndustrialSubType
    | LandSubType;
  verificationStatus: VerificationStatus;
  imagesUrl: string[];
  videoUrl?: string;
  ownerShipDocumentUrl: string;
  price: number;
  currency: string;
  lastUpdated: Date;
  reviewComments?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
}
