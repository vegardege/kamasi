import { Interval } from "#src/index.ts";

test("create interval with quality, number, and direction", () => {
  expect(new Interval("P", 1).toString()).toBe("P1");
  expect(new Interval("m", 3, "-").toString()).toBe("-m3");
  expect(new Interval("A", 28, "+").toString()).toBe("A28");
});

test("create interval with shorthand notation", () => {
  expect(Interval.fromString("M2").toString()).toBe("M2");
  expect(Interval.fromString("-d8").toString()).toBe("-d8");
  expect(Interval.fromString("+d44").toString()).toBe("d44");
});

test("create interval from semitones", () => {
  expect(Interval.fromSemitones(5).toString()).toBe("P4");
  expect(Interval.fromSemitones(-6).toString()).toBe("-A4");
  expect(Interval.fromSemitones(-21).toString()).toBe("-M13");
});

test("create interval from steps", () => {
  expect(Interval.fromSteps(2, 3).toString()).toBe("m3");
  expect(Interval.fromSteps(-4, -7).toString()).toBe("-P5");
  expect(Interval.fromSteps(14, 23).toString()).toBe("d15");
  expect(Interval.fromSteps(-9, -18).toString()).toBe("-AA10");
  expect(Interval.fromSteps(1, -1).toString()).toBe("dd2");
  expect(Interval.fromSteps(-1, 1).toString()).toBe("-dd2");
});

test("create invalid interval", () => {
  expect(() => new Interval("x", 4)).toThrowError(); // Invalid quality
  expect(() => new Interval("P", -1)).toThrowError(); // Invalid number
  expect(() => new Interval("P", 1, "/")).toThrowError(); // Invalid sign
  expect(() => new Interval("m", 1)).toThrowError(); // Invalid combination
  expect(() => new Interval({})).toThrowError(); // Invalid type
  expect(() => Interval.fromString("big")).toThrowError(); // Invalid string
  expect(() => Interval.fromString("P2")).toThrowError(); // Invalid combination
});

test("calculate diatonic and chromatic steps", () => {
  const steps = (q, a, s) => {
    const i = new Interval(q, a, s);
    return [i.diatonicSteps, i.chromaticSteps].join(", ");
  };
  expect(steps("M", 7)).toBe("6, 11");
  expect(steps("P", 12)).toBe("11, 19");
  expect(steps("P", 8, "-")).toBe("-7, -12");
  expect(steps("A", 18, "-")).toBe("-17, -30");
});

test("add and subtract intervals", () => {
  expect(new Interval("M", 3).add("m2").toString()).toBe("P4");
  expect(new Interval("A", 11, "-").add("P4").toString()).toBe("-A8");
  expect(new Interval("d", 20).sub("A11").toString()).toBe("dd10");
  expect(new Interval("P", 5, "-").sub("m3").toString()).toBe("-m7");
});

test("find the simple term of a compound interval", () => {
  expect(new Interval("M", 2).simpleTerm().toString()).toBe("M2");
  expect(new Interval("A", 16).simpleTerm().toString()).toBe("A2");
  expect(new Interval("M", 3, "-").simpleTerm().toString()).toBe("-M3");
  expect(new Interval("d", 14, "-").simpleTerm().toString()).toBe("-d7");
});

test("simplify an interval", () => {
  expect(new Interval("ddd", 18, "-").simplify().toString()).toBe("-M16");
});

test("calculate frequency ratio and cents", () => {
  expect(new Interval("m", 3).frequencyRatio()).toBeCloseTo(1.18921, 5);
  expect(new Interval("m", 3, "-").frequencyRatio()).toBeCloseTo(0.8409, 5);
  expect(new Interval("P", 15).frequencyRatio()).toBe(4);
  expect(new Interval("P", 5).cents()).toBe(700);
});

test("find inversion of interval", () => {
  expect(new Interval("P", 1).invert().toString()).toBe("P8");
  expect(new Interval("P", 8).invert().toString()).toBe("P1");
  expect(new Interval("P", 15, "-").invert().toString()).toBe("-P1");
  expect(new Interval("AA", 6).invert().toString()).toBe("dd3");
  expect(new Interval("M", 9, "-").invert().toString()).toBe("-m7");
});

test("check if intervals are compound", () => {
  expect(new Interval("M", 7).isCompound()).toBe(false);
  expect(new Interval("M", 13).isCompound()).toBe(true);
  expect(new Interval("m", 3, "-").isCompound()).toBe(false);
  expect(new Interval("P", 11, "-").isCompound()).toBe(true);
});

test("check if intervals are enharmonic", () => {
  expect(new Interval("M", 3).isEnharmonic("d4")).toBe(true);
  expect(new Interval("A", 6, "-").isEnharmonic("-m7")).toBe(true);
  expect(new Interval("d", 9).isEnharmonic("d2")).toBe(false);
});
