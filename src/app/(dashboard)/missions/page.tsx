import type { Metadata } from "next";
import MissionsPage from "@/components/missions/MissionsPage";

export const metadata: Metadata = {
  title: "Missions — Orbit",
  description: "Daily career progression missions. Small wins compound into big opportunities.",
};

export default function Page() {
  return <MissionsPage />;
}
