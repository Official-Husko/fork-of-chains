export namespace TextGagged {
  // Weighted choice helper
  function weightedChoice<T>(choices: [T, number][]): T {
    const total = choices.reduce((a, [, w]) => a + w, 0);
    let r = setup.rng.float() * total;
    for (const [item, weight] of choices) {
      if ((r -= weight) <= 0) return item;
    }
    return choices[0][0]; // fallback
  }

  const syllables = ["mm", "mmm", "hm", "ng", "rr", "gh"];
  const endings = ["ph", "ff", "gh", "mph", "pph", "rrf", "h"];
  const punct = ["!", "!!", "?!", "~", "~~~", "..."];

  // Occasional rare “outliers”
  const breaths = ["hhnnngh", "hff...", "(hnnh)", "*nghh*"];

  function stylize(core: string, mood: "discomfort" | "pleasure"): string {
    let out = core;

    // Random elongation of last char
    if (setup.rng.chance(mood === "pleasure" ? 0.5 : 0.2)) {
      const c = out[out.length - 1];
      out += c.repeat(setup.rng.int(2, mood === "pleasure" ? 6 : 3));
    }

    // Random uppercase
    if (setup.rng.chance(0.15)) {
      out = out.toUpperCase();
    }

    return out;
  }

  function randomGaggedSound({ mood }: { mood: "discomfort" | "pleasure" }): string {
    // Number of parts (discomfort shorter, pleasure longer)
    const parts = mood === "discomfort"
      ? setup.rng.int(2, 4) // 2–4
      : setup.rng.int(3, 6); // 3–6

    let out = "";

    for (let i = 0; i < parts; i++) {
      // Weighted syllables (pleasure favors "mmm", discomfort favors "hm"/"ng")
      const syll = mood === "pleasure"
        ? weightedChoice([["mm", 3], ["mmm", 4], ["hm", 1], ["ng", 1], ["rr", 2], ["gh", 2]])
        : weightedChoice([["mm", 2], ["mmm", 1], ["hm", 3], ["ng", 3], ["rr", 2], ["gh", 2]]);

      // Weighted endings
      const end = mood === "pleasure"
        ? weightedChoice([["ph", 2], ["ff", 1], ["gh", 2], ["mph", 2], ["pph", 1], ["rrf", 3], ["h", 2], ["", 3]])
        : weightedChoice([["ph", 4], ["ff", 3], ["gh", 2], ["mph", 3], ["pph", 3], ["rrf", 1], ["h", 1], ["", 2]]);

      let chunk = stylize(syll + end, mood);

      // 20% stutter chance
      if (setup.rng.chance(0.2)) chunk += "-";

      out += chunk;
    }

    // Rare outliers
    if (setup.rng.chance(0.05)) {
      out += " " + setup.rng.choice(breaths);
    }

    // Add punctuation (bias: discomfort -> sharp, pleasure -> trailing)
    if (setup.rng.chance(0.7)) {
      const p = mood === "pleasure"
        ? weightedChoice([["~", 3], ["~~~", 2], ["...", 2], ["!", 1]])
        : weightedChoice([["!", 3], ["!!", 2], ["?!", 1], ["...", 1]]);
      out += p;
    }

    return out;
  }

  export function discomfort({ unit }: { unit: Unit }): string {
    return randomGaggedSound({ mood: "discomfort" });
  }

  export function pleasure({ unit }: { unit: Unit }): string {
    return randomGaggedSound({ mood: "pleasure" });
  }
}
