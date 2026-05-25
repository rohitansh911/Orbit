import type { Metadata } from "next";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Orbit — Begin Your Launch Sequence",
  description: "Orbit personalizes your engineering growth system in under 2 minutes.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
