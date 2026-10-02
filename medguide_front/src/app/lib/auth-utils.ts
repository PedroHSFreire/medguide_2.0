import { getServerSession } from "./auth-clients";

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}
