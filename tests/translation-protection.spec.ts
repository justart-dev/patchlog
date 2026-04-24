import { expect, test } from "@playwright/test";

import { heroMap } from "../app/utils/heroMap";
import { extractUnmappedSkillLikeTerms } from "../app/utils/translationProtection";

test.describe("translation protection", () => {
  test("includes Gambit in the hero map for direct hero-name replacement", () => {
    expect(heroMap.Gambit).toBe("갬빗");
  });

  test("does not protect store bundle labels that start with a known hero name", () => {
    const content = [
      "2. Moon Knight - Suave Spector Ultimate Ability VFX",
      "Available From: [b][u]April 24th, 2026, 02 : 00 : 00 (UTC)[/u][/b]",
    ].join("\n");

    const terms = extractUnmappedSkillLikeTerms(content, {});

    expect(terms).toEqual([]);
  });

  test("does not protect store marketing labels for future multiword heroes either", () => {
    const content = "Jean Grey - Phoenix Force Bundle (Legendary)";

    const terms = extractUnmappedSkillLikeTerms(content, {});

    expect(terms).toEqual([]);
  });

  test("still protects non-marketing skill-like labels even when they include a hero name", () => {
    const content = "Moon Knight - Lunar Force (Q) deals damage.";

    const terms = extractUnmappedSkillLikeTerms(content, {});

    expect(terms).toContain("Moon Knight - Lunar Force");
  });

  test("still protects unmapped skill-like names that are not hero marketing labels", () => {
    const content = "The Ban Hammer (Q) deals damage.";

    const terms = extractUnmappedSkillLikeTerms(content, {});

    expect(terms).toContain("The Ban Hammer");
  });
});