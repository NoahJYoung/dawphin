export interface Key {
  type: "black" | "white";
  key: string;
  note: string;
  relativeOctave: number;
}

export const keys: Key[] = [
  {
    type: "white",
    key: "<",
    note: "C",
    relativeOctave: 0,
  },
  {
    type: "black",
    key: "a",
    note: "C#",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "z",
    note: "D",
    relativeOctave: 0,
  },
  {
    type: "black",
    key: "s",
    note: "D#",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "x",
    note: "E",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "c",
    note: "F",
    relativeOctave: 0,
  },
  {
    type: "black",
    key: "f",
    note: "F#",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "v",
    note: "G",
    relativeOctave: 0,
  },
  {
    type: "black",
    key: "g",
    note: "G#",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "b",
    note: "A",
    relativeOctave: 0,
  },
  {
    type: "black",
    key: "h",
    note: "A#",
    relativeOctave: 0,
  },
  {
    type: "white",
    key: "n",
    note: "B",
    relativeOctave: 0,
  },

  {
    type: "white",
    key: "q",
    note: "C",
    relativeOctave: 1,
  },
  {
    type: "black",
    key: "2",
    note: "C#",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "w",
    note: "D",
    relativeOctave: 1,
  },
  {
    type: "black",
    key: "3",
    note: "D#",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "e",
    note: "E",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "r",
    note: "F",
    relativeOctave: 1,
  },
  {
    type: "black",
    key: "5",
    note: "F#",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "t",
    note: "G",
    relativeOctave: 1,
  },
  {
    type: "black",
    key: "6",
    note: "G#",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "y",
    note: "A",
    relativeOctave: 1,
  },
  {
    type: "black",
    key: "7",
    note: "A#",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "u",
    note: "B",
    relativeOctave: 1,
  },
  {
    type: "white",
    key: "i",
    note: "C",
    relativeOctave: 2,
  },
  {
    type: "black",
    key: "9",
    note: "C#",
    relativeOctave: 2,
  },
  {
    type: "white",
    key: "o",
    note: "D",
    relativeOctave: 2,
  },
  {
    type: "black",
    key: "0",
    note: "D#",
    relativeOctave: 2,
  },
  {
    type: "white",
    key: "p",
    note: "E",
    relativeOctave: 2,
  },
];
