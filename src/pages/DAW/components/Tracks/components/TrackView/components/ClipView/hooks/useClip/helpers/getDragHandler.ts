/* eslint-disable @typescript-eslint/no-explicit-any */
import { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";
import * as d3 from "d3";
import { TOPBAR_HEIGHT } from "src/pages/DAW/constants";

interface GetDragHandler {
  audioEngine: AudioEngine;
  clip: Clip;
}

export const getDragHandler = ({ audioEngine, clip }: GetDragHandler) => {
  const currentParentTrackIndex = audioEngine.tracks.findIndex(
    (track) => track.id === clip.track.id
  );
  const dragHandler = d3
    .drag<any, unknown>()
    .on("start", function () {
      d3.select(this).raise();
    })
    .on("drag", function (event) {
      audioEngine.moveSelectedClips(event.dx);
      const indexDiff =
        Math.round(
          (event.y + TOPBAR_HEIGHT - currentParentTrackIndex * 84) / 84
        ) - 1;

      const newIndex = currentParentTrackIndex + indexDiff;

      const inRange =
        newIndex <= audioEngine.tracks.length - 1 && newIndex >= 0;

      const trackToSelectIndex =
        Math.round(
          (event.y + TOPBAR_HEIGHT - currentParentTrackIndex * 84) / 84
        ) - 1;

      if (
        audioEngine.selectedClips.every(
          (selectedClip) => selectedClip.track.id === clip.track.id
        ) &&
        inRange
      ) {
        audioEngine.selectedClips.forEach((selectedClip) =>
          selectedClip.setYOffset(trackToSelectIndex * 84)
        );
      }
    })
    .on("end", function (event) {
      if (
        audioEngine.selectedClips.every(
          (selectedClip) => selectedClip.track.id === clip.track.id
        )
      ) {
        audioEngine.selectedClips.forEach((selectedClip) => {
          const indexDiff =
            Math.round(
              (event.y + TOPBAR_HEIGHT - currentParentTrackIndex * 84) / 84
            ) - 1;

          const newIndex = currentParentTrackIndex + indexDiff;
          const hasChangedTracks = newIndex !== currentParentTrackIndex;

          const inRange =
            newIndex <= audioEngine.tracks.length - 1 && newIndex >= 0;

          if (hasChangedTracks) {
            if (inRange) {
              audioEngine.tracks[newIndex]
                .addClip(
                  selectedClip.audioBuffer,
                  selectedClip.start.toSeconds(),
                  selectedClip.fadeIn.toSamples(),
                  selectedClip.fadeOut.toSamples(),
                  selectedClip.peaksData
                )
                .setSelect(true);
              selectedClip.deleteClip();
              audioEngine.getSelectedClips();
            } else {
              const limitIndex =
                newIndex > audioEngine.tracks.length - 1
                  ? audioEngine.tracks.length - 1
                  : 0;
              audioEngine.tracks[limitIndex]
                .addClip(
                  selectedClip.audioBuffer,
                  selectedClip.start.toSeconds(),
                  selectedClip.fadeIn.toSamples(),
                  selectedClip.fadeOut.toSamples(),
                  selectedClip.peaksData
                )
                .setSelect(true);
              selectedClip.deleteClip();
              audioEngine.getSelectedClips();
            }
          }
        });
      }

      if (audioEngine.timeline.snap) {
        audioEngine.quantizeSelectedClips();
      }
      audioEngine.selectedClips.forEach((selectedClip) =>
        selectedClip.setYOffset(0)
      );
    });

  return dragHandler;
};
