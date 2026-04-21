// 2. Define the expected response shape from your server action
export interface ActionResponse {
  success?: boolean;
  error?: string;
  // add any other fields your action returns, e.g., user object
}
