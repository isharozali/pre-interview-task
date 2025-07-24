
/**
 * Type for a client record.
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  business_name: string;
  created_at: string;
}

/**
 * Strict type for form state.
 */
export interface ClientFormState {
  name: string;
  email: string;
  businessName: string;
}
