"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ORBIT_MEMORY, deriveEnergyState, EnergyState } from "@/lib/intelligence";

interface EnergyContextType {
  momentumScore: number;
  energyState: EnergyState;
  setMomentumScore: (score: number) => void;
}

const EnergyContext = createContext<EnergyContextType>({
  momentumScore: ORBIT_MEMORY.momentumScore,
  energyState: deriveEnergyState(ORBIT_MEMORY.momentumScore),
  setMomentumScore: () => {},
});

export const useEnergy = () => useContext(EnergyContext);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [momentumScore, setMomentumScore] = useState(ORBIT_MEMORY.momentumScore);
  const [energyState, setEnergyState] = useState<EnergyState>(deriveEnergyState(momentumScore));

  useEffect(() => {
    setEnergyState(deriveEnergyState(momentumScore));
  }, [momentumScore]);

  return (
    <EnergyContext.Provider value={{ momentumScore, energyState, setMomentumScore }}>
      {children}
    </EnergyContext.Provider>
  );
}
