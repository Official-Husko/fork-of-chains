import { Subrace } from "../classes/trait/Subrace";

export namespace TextRace {
  export function region(subrace_trait: Trait): string {
    const subrace = Subrace.fromTrait(subrace_trait);
    return subrace.homeland_region ?? "???";
  }

  export const REGIONS = {
    city: "City of Lucgate",
    vale: "Northern Vales",
    forest: "Western Forests",
    deep: "Deep",
    desert: "Eastern Deserts",
    sea: "Southern Seas",
    mist: "Mist",
    heaven: "Heavens",
  };
}
