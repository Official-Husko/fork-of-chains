export namespace TextGagged {
  /**
   * Helper function to select a value from a weighted list of choices.
   * @template T - The type of the choice item.
   * @param choices - Array of [item, weight] pairs.
   * @returns The selected item.
   */
  function weightedChoice<T>(choices: Array<[T, number]>): T {
    const total: number = choices.reduce((a, [, w]) => a + w, 0);
    let r: number = setup.rng.float() * total;
    for (const [item, weight] of choices) {
      if ((r -= weight) <= 0) return item;
    }
    return choices[0][0]; // fallback in case of rounding errors
  }

  /**
   * Syllables used for gagged sounds.
   */
  const syllables: string[] = ["mm", "mmm", "hm", "ng", "rr", "gh"];
  /**
   * Endings used for gagged sounds.
   */
  const endings: string[] = ["ph", "ff", "gh", "mph", "pph", "rrf", "h"];
  /**
   * Punctuation options for gagged sounds.
   */
  const punct: string[] = ["!", "!!", "?!", "~", "~~~", "..."];

  /**
   * Rare outlier sounds for extra flavor.
   */
  const breaths: string[] = ["hhnnngh", "hff...", "(hnnh)", "*nghh*"];

  /**
   * Stylizes a gagged sound chunk based on mood.
   * Adds elongation and random uppercase for variety.
   * @param core - The base string to stylize.
   * @param mood - The mood, either "discomfort" or "pleasure".
   * @returns Stylized string.
   */
  function stylize(core: string, mood: "discomfort" | "pleasure"): string {
    let out: string = core;

    // Random elongation of last character (more for pleasure)
    if (setup.rng.chance(mood === "pleasure" ? 0.5 : 0.2)) {
      const c: string = out[out.length - 1];
      out += c.repeat(setup.rng.int(2, mood === "pleasure" ? 6 : 3));
    }

    // Random uppercase for emphasis
    if (setup.rng.chance(0.15)) {
      out = out.toUpperCase();
    }

    return out;
  }

  /**
   * Generates a random gagged sound string based on mood.
   * @param params.mood - "discomfort" or "pleasure".
   * @returns A stylized gagged sound string.
   */
  function randomGaggedSound(params: { mood: "discomfort" | "pleasure" }): string {
    const { mood } = params;
    // Number of sound parts: discomfort shorter, pleasure longer
    const parts: number = mood === "discomfort"
      ? setup.rng.int(2, 4)
      : setup.rng.int(3, 6);

    let out: string = "";

    for (let i = 0; i < parts; i++) {
      // Weighted syllable selection
      const syll: string = mood === "pleasure"
        ? weightedChoice([["mm", 3], ["mmm", 4], ["hm", 1], ["ng", 1], ["rr", 2], ["gh", 2]])
        : weightedChoice([["mm", 2], ["mmm", 1], ["hm", 3], ["ng", 3], ["rr", 2], ["gh", 2]]);

      // Weighted ending selection
      const end: string = mood === "pleasure"
        ? weightedChoice([["ph", 2], ["ff", 1], ["gh", 2], ["mph", 2], ["pph", 1], ["rrf", 3], ["h", 2], ["", 3]])
        : weightedChoice([["ph", 4], ["ff", 3], ["gh", 2], ["mph", 3], ["pph", 3], ["rrf", 1], ["h", 1], ["", 2]]);

      let chunk: string = stylize(syll + end, mood);

      // 20% chance to add a stutter
      if (setup.rng.chance(0.2)) chunk += "-";

      out += chunk;
    }

    // Occasionally add a rare outlier sound
    if (setup.rng.chance(0.05)) {
      out += " " + setup.rng.choice(breaths);
    }

    // Add punctuation: discomfort = sharp, pleasure = trailing
    if (setup.rng.chance(0.7)) {
      const p: string = mood === "pleasure"
        ? weightedChoice([["~", 3], ["~~~", 2], ["...", 2], ["!", 1]])
        : weightedChoice([["!", 3], ["!!", 2], ["?!", 1], ["...", 1]]);
      out += p;
    }

    return out;
  }

  /**
   * Generate a gagged sound representing discomfort for a unit.
   * @param params.unit - The unit object (not used, for API consistency).
   * @returns A gagged sound string expressing discomfort.
   */
  export function discomfort(params: { unit: Unit }): string {
    return randomGaggedSound({ mood: "discomfort" });
  }

  /**
   * Generate a gagged sound representing pleasure for a unit.
   * @param params.unit - The unit object (not used, for API consistency).
   * @returns A gagged sound string expressing pleasure.
   */
  export function pleasure(params: { unit: Unit }): string {
    return randomGaggedSound({ mood: "pleasure" });
  }
}
