export namespace TextGagged {
  // Occasional rare “outliers”
  const breaths = ["hhnnngh", "hff...", "(hnnh)", "*nghh*"] as const;

  type Mood = "discomfort" | "pleasure";
  type Weighted<T> = ReadonlyArray<readonly [T, number]>;

  // Centralized weight tables, precomputed once
  const WEIGHTS: Record<
    Mood,
    {
      syllables: Weighted<string>;
      endings: Weighted<string>;
      punct: Weighted<string>;
      partsMinMax: readonly [number, number]; // [min, max] for part counts
    }
  > = {
    pleasure: {
      syllables: [
        ["mm", 3],
        ["mmm", 4],
        ["hm", 1],
        ["ng", 1],
        ["rr", 2],
        ["gh", 2],
      ],
      endings: [
        ["ph", 2],
        ["ff", 1],
        ["gh", 2],
        ["mph", 2],
        ["pph", 1],
        ["rrf", 3],
        ["h", 2],
        ["", 3],
      ],
      punct: [
        ["~", 3],
        ["~~~", 2],
        ["...", 2],
        ["!", 1],
      ],
      partsMinMax: [3, 6],
    },
    discomfort: {
      syllables: [
        ["mm", 2],
        ["mmm", 1],
        ["hm", 3],
        ["ng", 3],
        ["rr", 2],
        ["gh", 2],
      ],
      endings: [
        ["ph", 4],
        ["ff", 3],
        ["gh", 2],
        ["mph", 3],
        ["pph", 3],
        ["rrf", 1],
        ["h", 1],
        ["", 2],
      ],
      punct: [
        ["!", 3],
        ["!!", 2],
        ["?!", 1],
        ["...", 1],
      ],
      partsMinMax: [2, 4],
    },
  } as const;

  // Keep behavior identical to your previous version:
  // - normalize weights
  // - never return null (fallback to first item)
  function pickWeighted<T>(table: Weighted<T>, fallbackIndex = 0): T {
    return (
      setup.rng.sampleArray(table as [T, number][], true) ??
      table[fallbackIndex][0]
    );
  }

  function stylize(core: string, mood: Mood): string {
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

  function randomGaggedSound({ mood }: { mood: Mood }): string {
    const cfg = WEIGHTS[mood];

    // Number of parts
    const parts = setup.rng.int(cfg.partsMinMax[0], cfg.partsMinMax[1]);

    let out = "";
    for (let i = 0; i < parts; i++) {
      const syll = pickWeighted(cfg.syllables);
      const end = pickWeighted(cfg.endings);

      let chunk = stylize(syll + end, mood);

      // 20% stutter chance
      if (setup.rng.chance(0.2)) chunk += "-";

      out += chunk;
    }

    // Rare outliers
    if (setup.rng.chance(0.05)) {
      out += " " + setup.rng.choice(breaths as unknown as string[]);
    }

    // Add punctuation (bias handled via precomputed tables)
    if (setup.rng.chance(0.7)) {
      out += pickWeighted(cfg.punct);
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
