export type Account = {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  avatarUrl?: string;
  type: "Customer" | "Vendor";
  businessName?: string;
  businessType?: BusinessType;
  createdAt: Date;
  rating: number;
  services?: VendorService[];
  appointmentsAsUser?: Appointment[];
  appointmentsAsVendor?: Appointment[];
};

export type VendorService = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
};

export type Appointment = {
  id: string;
  time: Date;
  opened: boolean;
  createdAt: Date;
  vendorId: string;
  vendor?: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
};
