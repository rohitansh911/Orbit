export interface OnboardingData {
  careerGoal: string;
  currentLevel: string;
  struggles: string[];
  skills: string[];
  dreamCompanies: string[];
  customCompany: string;
}

export const defaultOnboardingData: OnboardingData = {
  careerGoal: "",
  currentLevel: "",
  struggles: [],
  skills: [],
  dreamCompanies: [],
  customCompany: "",
};
