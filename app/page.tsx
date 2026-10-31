import LandingClient from "./components/LandingClient";
import { getUntranslatedCount } from "@/lib/patches";

export const revalidate = 300;

export default async function Page() {
  const untranslatedCount = await getUntranslatedCount().catch(() => 0);

  return <LandingClient untranslatedCount={untranslatedCount} />;
}
