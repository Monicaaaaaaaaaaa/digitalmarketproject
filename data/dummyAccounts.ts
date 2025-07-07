import vendorJson from "~/data/accounts.json";

export const dummyAccounts: Account[] = vendorJson.map(
  (vendor: any): Account => ({
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    rating: vendor.rating,
    phoneNumber: vendor.phoneNumber,
    avatarUrl: vendor.avatarUrl,
    type: vendor.type as AccountType,
    businessName: vendor.businessName,
    businessType: vendor.businessType as BusinessType,
    createdAt: new Date(vendor.createdAt),
    services: vendor.services?.map((s: any) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      imageUrl: s.imageUrl,
      createdAt: new Date(s.createdAt),
    })),
    appointmentsAsUser: [],
    appointmentsAsVendor: [],
  })
);
