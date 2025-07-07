export const goBack = () => {
  const router = useRouter();

  router.go(-1); // Navigate to the previous page in history
};

export function toAccount(raw: any): Account {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phoneNumber: raw.phoneNumber,
    avatarUrl: raw.avatarUrl,
    rating: raw.rating,
    type: raw.type as AccountType,
    businessName: raw.businessName,
    businessType: raw.businessType as BusinessType,
    createdAt: new Date(raw.createdAt),
    services: raw.services?.map((s: any) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      imageUrl: s.imageUrl,
      createdAt: new Date(s.createdAt),
    })),
    appointmentsAsUser: [],
    appointmentsAsVendor: [],
  };
}
