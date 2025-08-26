export namespace TextPet {
  type Weighted<T> = ReadonlyArray<readonly [T, number]>;

  // ---------- Shared RNG wrapper (normalize + fallback, never returns null)
  function pickWeighted<T>(table: Weighted<T>, fallbackIndex = 0): T {
    return (
      setup.rng.sampleArray(table as [T, number][], true) ??
      table[fallbackIndex][0]
    );
  }

  // ---------- REARWAG ----------

  // Precomputed weighted tables for phrase parts
  const REARWAG = {
    adverbs: [
      ["invitingly", 3],
      ["submissively", 3],
      ["obediently", 2],
      ["eagerly", 2],
      ["shyly", 1],
      ["teasingly", 2],
      ["cutely", 3],
      ["needily", 1],
    ] as Weighted<string>,
    verbs: [
      ["wagging", 5],
      ["swaying", 4],
      ["flicking", 2],
      ["shimmying", 2],
      ["writhing", 1],
      ["waggling", 1],
      ["swishing", 3],
    ] as Weighted<string>,
    // Optional mid-qualifier (0–1 of these)
    qualifiers: [
      ["left and right", 4],
      ["back and forth", 3],
      ["in small arcs", 2],
      ["in wide arcs", 2],
      ["in a steady rhythm", 2],
      ["with little shivers", 1],
      ["for attention", 1],
    ] as Weighted<string>,
    // Optional similes (0–1 of these)
    similes: [
      ["like a pet dog", 3],
      ["like a good pet", 3],
      ["like they’re trained", 1],
      ["like they can’t help it", 2],
      ["like a needy bitch", 1],
    ] as Weighted<string>,
    // Punctuation bias: mostly light trailing
    punct: [
      ["", 6],
      ["...", 3],
      ["~", 3],
      ["!!", 1],
      ["!", 2],
    ] as Weighted<string>,
    // Small chance to add a stutter hyphen after verb (wagging-)
    stutterChance: 0.15,
  } as const;

  export function rearwag(unit: Unit): string {
    const tail = unit.getTail();
    const plug = unit.getTailPlug();
    const tailrep = !tail && !plug ? `a|ass` : `a|ctail`;

    const adv = pickWeighted(REARWAG.adverbs);
    const verb = pickWeighted(REARWAG.verbs);
    const qual = setup.rng.chance(0.55) ? pickWeighted(REARWAG.qualifiers) : "";
    const sim = setup.rng.chance(0.45) ? pickWeighted(REARWAG.similes) : "";
    const punct = pickWeighted(REARWAG.punct);

    // Occasional verb stutter (“wagging-”) to give a lively feel
    const verbOut = setup.rng.chance(REARWAG.stutterChance) ? `${verb}-` : verb;

    // Compose: “[adverb] [verb] a|their [tailrep] [qualifier] [simile][punct]”
    // Keep spaces tidy if qual/sim are absent.
    const parts = [
      adv,
      verbOut,
      `a|their ${tailrep}`,
      qual && `${qual}`,
      sim && `${sim}`,
    ].filter(Boolean);

    const line = parts.join(" ") + punct;

    return setup.Text.replaceUnitMacros(line, { a: unit });
  }

  // ---------- WHINE ----------

  type VocalMode = "talk" | "muffled";

  const WHINE = {
    talk: {
      openers: [
        ["(Whines)", 3],
        ["(Whimpers)", 3],
        ["Yelp", 2],
        ["Yip", 2],
        ["Whiiine", 1],
        ["Whiiiimper", 1],
      ] as Weighted<string>,
      // Tail marks tend to be lighter for talk-capable
      tail: [
        ["...", 4],
        ["!", 2],
        ["!!", 1],
        ["~", 2],
        ["", 2],
      ] as Weighted<string>,
      // Optional softener/adverb preceding opener
      adverbs: [
        ["softly", 3],
        ["helplessly", 2],
        ["pitifully", 2],
        ["needily", 1],
        ["shakily", 1],
        ["", 5], // often omitted
      ] as Weighted<string>,
      elongChance: 0.35, // chance to stretch last char
      punctExtraChance: 0.25, // chance to add a second, softer tail mark
    },
    muffled: {
      openers: [
        ["(Muffled whine)", 3],
        ["Mmph", 3],
        ["Nnyh", 2],
        ["Mrrlw", 2],
        ["Hnnh", 2],
        ["Mmmh", 2],
      ] as Weighted<string>,
      tail: [
        ["...", 5],
        ["~", 2],
        ["!", 1],
        ["!!", 1],
        ["", 2],
      ] as Weighted<string>,
      adverbs: [
        ["quietly", 2],
        ["strangled", 1],
        ["through the gag", 3],
        ["", 6],
      ] as Weighted<string>,
      elongChance: 0.5, // muffled sounds stretch more
      punctExtraChance: 0.2,
    },
  } as const;

  function stylizeVocal(core: string, mode: VocalMode): string {
    // random uppercase small chance for bursts
    if (setup.rng.chance(0.1)) core = core.toUpperCase();

    // elongate last char based on mode
    const cfg = WHINE[mode];
    if (setup.rng.chance(cfg.elongChance) && core.length) {
      const c = core[core.length - 1];
      const extra = setup.rng.int(1, mode === "muffled" ? 4 : 3);
      core += c.repeat(extra);
    }
    return core;
  }

  export function whine(unit: Unit): string {
    const mode: VocalMode = unit.isCanPhysicallyTalk() ? "talk" : "muffled";
    const cfg = WHINE[mode];

    const adv = pickWeighted(cfg.adverbs);
    let opener = pickWeighted(cfg.openers);
    opener = stylizeVocal(opener, mode);

    let out = adv ? `${adv} ${opener}` : opener;

    // primary punctuation/tail
    out += pickWeighted(cfg.tail);

    // occasional second soft tail (e.g., “...~” or “!!...”)
    if (setup.rng.chance(cfg.punctExtraChance)) {
      out += pickWeighted(cfg.tail);
    }

    // Keep the original style of returning a single string with macros applied
    return setup.Text.replaceUnitMacros(out, { a: unit });
  }
}
