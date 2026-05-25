// Onboarding has its own full-screen layout — no sidebar/topnav
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
