import { useLanguageStore } from "@/store/language-store";
import type { Lang } from "@/store/language-store";

type TranslationMap = Record<string, Record<string, string>>;

const commonTranslations: Record<Lang, Record<string, string>> = {
  en: {
    // Complexity types
    action: "Action",
    dialogue: "Dialogue",
    vfx: "VFX",
    romantic: "Romantic",
    song: "Song",
    stunt: "Stunt",
    // Status labels
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    extreme: "Extreme",
    // Generic
    scene: "Scene",
    scenes: "Scenes",
    noChange: "No change",
    health: "Health",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    upload: "Upload",
    continue: "Continue",
    shots: "shots",
  },
  te: {
    // Complexity types
    action: "యాక్షన్",
    dialogue: "సంభాషణ",
    vfx: "VFX",
    romantic: "రొమాంటిక్",
    song: "పాట",
    stunt: "స్టంట్",
    // Status labels
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "అధికం",
    critical: "క్రిటికల్",
    extreme: "అత్యధికం",
    // Generic
    scene: "సన్నివేశం",
    scenes: "సన్నివేశాలు",
    noChange: "మార్పు లేదు",
    health: "ఆరోగ్యం",
    cancel: "రద్దు",
    close: "మూసివేయి",
    save: "సేవ్",
    upload: "అప్‌లోడ్",
    continue: "కొనసాగించు",
    shots: "షాట్లు",
  },
};

export function useTranslation(ns?: TranslationMap) {
  const { lang, setLang } = useLanguageStore();

  const t = (key: string): string => {
    return (
      ns?.[lang]?.[key] ||
      commonTranslations[lang]?.[key] ||
      ns?.en?.[key] ||
      commonTranslations.en?.[key] ||
      key
    );
  };

  return { t, lang, setLang };
}
