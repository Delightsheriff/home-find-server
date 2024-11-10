export enum Role {
  ADMIN = "admin",
  TENANT = "tenant",
  LANDLORD = "landlord",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
  None = "none",
}

export enum Purpose {
  Rent = "rent",
  Sell = "sell",
  Lease = "lease",
}

export enum PropertyType {
  RESIDENTIAL = "residential",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial",
}

export enum ResidentialSubType {
  BoysQuarters = "boysQuarters",
  Bungalow = "bungalow",
  Duplex = "duplex",
  SelfContain = "selfContain",
  Penthouse = "penthouse",
  MiniFlat = "miniFlat",
}

export enum CommercialSubType {
  Hotel = "hotel",
  OfficeSpace = "officeSpace",
  Shop = "shop",
  Restaurant = "restaurant",
  EventCenter = "eventCenter",
  School = "school",
  Hospital = "hospital",
  FillingStation = "fillingStation",
  Workshop = "workshop",
  Showroom = "showroom",
  PrivateOffice = "privateOffice",
}

export enum IndustrialSubType {
  Warehouse = "warehouse",
  Factory = "factory",
}

export enum PaymentStatus {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}

export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified",
  Rejected = "rejected",
}

export enum Currency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
}
