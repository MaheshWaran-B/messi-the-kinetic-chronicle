import React, { createContext, useContext, useState, ReactNode } from "react";

export type BackgroundSection =
  | "hero"
  | "rosario"
  | "barcelona-begins"
  | "dynasty"
  | "glory"
  | "counters"
  | "trophy-room"
  | "tactical"
  | "paris"
  | "miami"
  | "coda";

interface BackgroundContextType {
  activeSection: BackgroundSection;
  setActiveSection: (section: BackgroundSection) => void;
  overrideImage: string | null;
  setOverrideImage: (img: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<BackgroundSection>("hero");
  const [overrideImage, setOverrideImage] = useState<string | null>(null);

  return (
    <BackgroundContext.Provider
      value={{
        activeSection,
        setActiveSection,
        overrideImage,
        setOverrideImage,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
