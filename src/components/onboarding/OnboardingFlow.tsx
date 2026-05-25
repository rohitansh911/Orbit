"use client";

import { useState, useCallback } from "react";
import { OnboardingData, defaultOnboardingData } from "./types";

import WelcomeStep from "./steps/WelcomeStep";
import CareerGoalStep from "./steps/CareerGoalStep";
import CurrentLevelStep from "./steps/CurrentLevelStep";
import BiggestStruggleStep from "./steps/BiggestStruggleStep";
import SkillInputStep from "./steps/SkillInputStep";
import DreamCompaniesStep from "./steps/DreamCompaniesStep";
import AnalysisStep from "./steps/AnalysisStep";
import RevealStep from "./steps/RevealStep";

// Steps 0–6 are user-input steps; 7 = analysis; 8 = reveal
// totalSteps shown in progress dots = 6 (0-5, excluding analysis + reveal)
const TOTAL_INPUT_STEPS = 6;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(0); // forces re-mount for animation
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const advance = useCallback((updater?: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...(updater ?? {}) }));
    setStep((s) => s + 1);
    setStepKey((k) => k + 1);
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Background: warm cream base + subtle grain
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div key={stepKey} className="relative z-10">
        {step === 0 && (
          <WelcomeStep
            onNext={() => advance()}
            step={0}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 1 && (
          <CareerGoalStep
            onNext={(careerGoal) => advance({ careerGoal })}
            step={1}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 2 && (
          <CurrentLevelStep
            onNext={(currentLevel) => advance({ currentLevel })}
            step={2}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 3 && (
          <BiggestStruggleStep
            onNext={(struggles) => advance({ struggles })}
            step={3}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 4 && (
          <SkillInputStep
            onNext={(skills) => advance({ skills })}
            step={4}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 5 && (
          <DreamCompaniesStep
            onNext={(dreamCompanies) => advance({ dreamCompanies })}
            step={5}
            totalSteps={TOTAL_INPUT_STEPS}
          />
        )}
        {step === 6 && (
          <AnalysisStep onDone={() => advance()} />
        )}
        {step === 7 && (
          <RevealStep data={data} />
        )}
      </div>
    </div>
  );
}
