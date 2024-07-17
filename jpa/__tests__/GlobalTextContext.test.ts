import { IsEndOfSentence } from "@/GlobalTextContext/GlobalTextContext";
import { IpadicFeatures } from "kuromoji";

describe("IsEndOfSentence", () => {
  it("should return true for tokens containing end of sentence characters", () => {
    const tokens = [
      { surface_form: "こんにちは。" },
      { surface_form: "おはようございます。" },
      { surface_form: "こんばんは！" },
    ] as IpadicFeatures[];

    expect(IsEndOfSentence(0, tokens)).toBe(true);
    expect(IsEndOfSentence(1, tokens)).toBe(true);
    expect(IsEndOfSentence(2, tokens)).toBe(true);
  });
});
