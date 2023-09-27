import React from "react";
import "./PianoRoll.scss";

interface Note {
  start: number;
  end: number;
  pitch: number;
}

interface PianoRollProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
}

const TOTAL_KEYS = 88;
const START_KEY = 21;

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function getNoteNameFromMidiValue(midiValue: number): string {
  const octave = Math.floor(midiValue / 12) - 1;
  return `${NOTE_NAMES[(Number(midiValue) + 11) % 12]}${octave}`;
}

export const PianoRoll: React.FC<PianoRollProps> = ({ notes, onNoteClick }) => {
  return (
    <div className="container styled-scrollbar">
      <div className="piano">
        {Array.from({ length: TOTAL_KEYS }).map((_, i) => {
          const midiValue = START_KEY + TOTAL_KEYS - i;
          const isBlackKey = [1, 3, 6, 8, 10].includes((midiValue + 11) % 12);

          return (
            <div
              key={midiValue}
              className={`key ${isBlackKey ? "black" : "white"}`}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                }}
              >
                {getNoteNameFromMidiValue(midiValue)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="piano-roll">
        {Array.from({ length: TOTAL_KEYS }).map((_, index) => {
          const midiValue = START_KEY + TOTAL_KEYS - index;
          const isBlackKey = [1, 3, 6, 8, 10].includes((midiValue + 11) % 12);
          return (
            <div
              key={midiValue}
              className={`key ${isBlackKey ? "black" : "white"}`}
            >
              {notes
                .filter((note) => note.pitch === midiValue)
                .map((note) => (
                  <div
                    key={note.start}
                    className="note"
                    style={{
                      left: `${note.start}px`,
                      width: `${note.end - note.start}px`,
                    }}
                    onClick={() => onNoteClick && onNoteClick(note)}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PianoRoll;
