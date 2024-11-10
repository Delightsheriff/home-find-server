import { Currency, PropertyType, Purpose } from "../constants";
import {
  ResidentialSubType,
  CommercialSubType,
  IndustrialSubType,
} from "../constants";

// Validation function
export function validatePropertyData(data: any): string[] {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    "title",
    "description",
    "purpose",
    "propertyType",
    "subType",
    "size",
    "bedrooms",
    "bathrooms",
    "toilets",
    "slots",
    "stateCapital",
    "localGovernment",
    "address",
    "amenities",
    "price",
    "currency",
  ];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Specific validations
  if (data.title && data.title.length > 100) {
    errors.push("Title cannot be more than 100 characters");
  }

  if (data.description && data.description.length > 1000) {
    errors.push("Description cannot be more than 1000 characters");
  }

  if (data.size && data.size < 0) {
    errors.push("Size cannot be negative");
  }

  if (data.bedrooms && data.bedrooms < 0) {
    errors.push("Number of bedrooms cannot be negative");
  }

  if (data.bathrooms && data.bathrooms < 0) {
    errors.push("Number of bathrooms cannot be negative");
  }

  if (data.toilets && data.toilets < 0) {
    errors.push("Number of toilets cannot be negative");
  }

  if (data.slots && data.slots < 0) {
    errors.push("Number of slots cannot be negative");
  }

  if (data.price && data.price < 0) {
    errors.push("Price cannot be negative");
  }

  if (data.purpose && !Object.values(Purpose).includes(data.purpose)) {
    errors.push("Invalid purpose");
  }

  if (
    data.propertyType &&
    !Object.values(PropertyType).includes(data.propertyType)
  ) {
    errors.push("Invalid property type");
  }

  if (data.currency && !Object.values(Currency).includes(data.currency)) {
    errors.push("Invalid currency");
  }

  // Subtype validation
  if (data.propertyType && data.subType) {
    let validSubTypes: string | any[];
    switch (data.propertyType) {
      case PropertyType.RESIDENTIAL:
        validSubTypes = Object.values(ResidentialSubType);
        break;
      case PropertyType.COMMERCIAL:
        validSubTypes = Object.values(CommercialSubType);
        break;
      case PropertyType.INDUSTRIAL:
        validSubTypes = Object.values(IndustrialSubType);
        break;

      default:
        validSubTypes = [];
    }
    if (!validSubTypes.includes(data.subType)) {
      errors.push("Invalid subType for the selected propertyType");
    }
  }

  return errors;
}
