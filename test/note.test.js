import { Interval, Note } from "#src/index.ts";

test("create note with letter, accidentals, and octave", () => {
  expect(new Note("C").toString()).toBe("C");
  expect(new Note("D", "#").toString()).toBe("D#");
  expect(new Note("e", "b", 4).toString()).toBe("Eb4");
});

test("create interval from scientific pitch notation", () => {
  expect(Note.fromString("F##").toString()).toBe("F##");
  expect(Note.fromString("Gbb3").toString()).toBe("Gbb3");
  expect(Note.fromString("A####-1").toString()).toBe("A####-1");
});

test("create invalid note", () => {
  expect(() => new Note("x", "#")).toThrowError(); // Invalid letter
  expect(() => new Note("C", "x")).toThrowError(); // Invalid accidentals
  expect(() => new Note("C", "#", "x")).toThrowError(); // Invalid octave
  expect(() => new Note({})).toThrowError(); // Invalid type
  expect(() => Note.fromString("big")).toThrowError(); // Invalid string
  expect(() => Note.fromString("D#b")).toThrowError(); // Invalid accidentals
});

test("calcuate diatonic and chromatic offset", () => {
  const offset = (n, a, o) => {
    n = new Note(n, a, o);
    return [n.diatonicOffset, n.chromaticOffset].join(", ");
  };
  expect(offset("C")).toBe("0, 0");
  expect(offset("F", "#")).toBe("3, 6");
  expect(offset("G", "b", 4)).toBe("4, 6");
  expect(offset("B", "####")).toBe("6, 15");
});

// Transposition tests
test("transpose function input", () => {
  expect(new Note("C").transpose(new Interval("P", 5)).toString()).toBe("G");
  expect(new Note("D", "b").transpose("m3").toString()).toBe("Fb");
});

const t = (note, interval) =>
  Note.fromString(note).transpose(interval).toString();
test("transpose note by positive simple interval", () => {
  expect(t("C", "P8")).toBe("C");
  expect(t("Db", "A5")).toBe("A");
  expect(t("E#4", "M3")).toBe("G##4");
});

test("transpose note by negative simple interval", () => {
  expect(t("D", "-P8")).toBe("D");
  expect(t("Bbb", "-d5")).toBe("Eb");
  expect(t("A#5", "-m7")).toBe("B#4");
});

test("transpose note by compound interval", () => {
  expect(t("E", "P15")).toBe("E");
  expect(t("Fbb", "-d14")).toBe("Gb");
  expect(t("G#4", "M14")).toBe("F##6");
});

test("transpose difficult notes", () => {
  expect(t("B###4", "m2")).toBe("C###5");
  expect(t("Dbbbbbb", "A6")).toBe("Bbbbbb");
  expect(t("Cbb5", "-d3")).toBe("Ab4");
  expect(t("B#############2", "A3")).toBe("D###############3");
});

test("transpose with numbers", () => {
  expect(t("C", 2)).toBe("D");
  expect(t("D#4", -5)).toBe("A#3");
});

test("calculate distance between notes and enharmonicity", () => {
  expect(new Note("C", "", 4).distance("F4")).toBe(5);
  expect(new Note("A", "bb").distance("D#")).toBe(8);
  expect(new Note("B", "", 3).distance("C6")).toBe(25);
  expect(new Note("C", "##").isEnharmonic("Ebb")).toBe(true);
  expect(new Note("C", "##", 4).isEnharmonic("Ebb5")).toBe(false);
});

test("calculate interval between two notes", () => {
  // More tests in interval.test.js, this is just for the wrapper
  expect(new Note("C", "#").intervalTo("Ab").toString()).toBe("d6");
  expect(new Note("C", "#", 3).intervalFrom("Ab2").toString()).toBe("A3");
  expect(() => new Note("C", "#").intervalTo("D4").toString()).toThrow();
});

test("calculate frequency and midi of note", () => {
  expect(new Note("C", "", 4).frequency()).toBeCloseTo(261.6256, 3);
  expect(new Note("B", "", 7).frequency()).toBeCloseTo(3951.066, 2);
  expect(new Note("C", "", 0).frequency()).toBeCloseTo(16.3516, 3);
  expect(new Note("F", "", 1).midi()).toBe(29);
  expect(new Note("G", "#", 8).midi()).toBe(116);
  expect(new Note("C", "", -2).midi()).toBe(NaN);
  expect(new Note("B", "", 9).midi()).toBe(NaN);
});

test("simplify a note", () => {
  expect(new Note("F", "####").simplify().toString()).toBe("A");
  expect(new Note("D", "bbbb", 4).simplify().toString()).toBe("A#3");
  expect(new Note("B", "#############", 2).simplify().toString()).toBe("C4");
});

test("convert between pitch classes and pitches", () => {
  expect(new Note("C").toPitchClass().toString()).toBe("C");
  expect(new Note("D", "", 4).toPitchClass().toString()).toBe("D");
  expect(new Note("E", "#").toPitch(4).toString()).toBe("E#4");
  expect(new Note("F").isPitchClass()).toBe(true);
  expect(new Note("G", "#", 4).isPitchClass()).toBe(false);
});

test("check equality", () => {
  expect(new Note("C", "#", 4).isEqual("C#4")).toBe(true);
  expect(new Note("C", "#").isEqual("C#4")).toBe(false);
  expect(new Note("C", "", 4).isEqual("C#4")).toBe(false);
  expect(new Note("D", "#", 4).isEqual("C#4")).toBe(false);
  expect(new Note("D", "#", 4).isEqual("C#")).toBe(false);
  expect(new Note("D", "#", 4).isEqual("D#")).toBe(false);
  expect(new Note("D", "#", 4).isEqual("D4")).toBe(false);
});
