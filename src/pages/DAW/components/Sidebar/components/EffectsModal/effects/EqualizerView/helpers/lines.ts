export interface LineData {
  value: number;
  displayValue: string;
}

export interface Band {
  hertz: number;
  gain: number;
  Q: number;
}

export interface Point {
  hertz: number;
  gain: number;
}

export const bands: Band[] = [
  // { hertz: 20, gain: 0, Q: 1 },
  { hertz: 200, gain: 2, Q: 0.5 },
  // { hertz: 850, gain: 5, Q: 0.1 },
  { hertz: 800, gain: 5, Q: 0.5 },
  // { hertz: 17000, gain: 5, Q: 4.3 },
  // { hertz: 2000, gain: 8, Q: 10 },
  // { hertz: 5000, gain: 4, Q: 4 },
  { hertz: 500, gain: -4, Q: 1 },
  // { hertz: 20000, gain: 0, Q: 1 },
];

export const xLines: LineData[] = [
  {
    value: 20,
    displayValue: "20",
  },
  {
    value: 50,
    displayValue: "50",
  },
  {
    value: 100,
    displayValue: "100",
  },
  {
    value: 200,
    displayValue: "200",
  },
  {
    value: 300,
    displayValue: "300",
  },
  {
    value: 500,
    displayValue: "500",
  },
  {
    value: 1000,
    displayValue: "1k",
  },
  {
    value: 2000,
    displayValue: "2k",
  },
  {
    value: 3000,
    displayValue: "3k",
  },
  {
    value: 5000,
    displayValue: "5k",
  },
  {
    value: 10000,
    displayValue: "10k",
  },
  {
    value: 20000,
    displayValue: "20k",
  },
];

export const yLines: LineData[] = [
  {
    value: -6,
    displayValue: "-6",
  },
  {
    value: 0,
    displayValue: "+0",
  },
  {
    value: 6,
    displayValue: "+6",
  },
];
