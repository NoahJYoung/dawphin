import { types } from 'mobx-state-tree';
import * as Tone from 'tone';

// const ClipboardItem = types.model('ClipboardItem', {
//   data: types.model({}).volatile((self) => ({
//     data: new Blob(),
//     start: Tone.Time(0)
//   })).actions(self => ({
//     setData(data: Blob) {
//       self.data = data;
//     },
//     setStart(start: Tone.TimeClass) {
//       self.start = start;
//     }
//   }))
// })

const ClipboardItem = types.model('ClipboardItem', {
  data: types.frozen(),
  start: types.optional(types.number, 0), // Replace with appropriate type
});

const metronome = types.model({}).volatile(() => new Tone.PluckSynth().toDestination())

const MST_Track = types.model('Track', {

})

const MST_Clip = types.model('Clip', {

})

export const MST_AudioEngine = types
  .model('AudioEngine', {
    state: types.optional(types.enumeration(['playing', 'stopped', 'paused', 'recording']), 'stopped'),
    zoomLevels: types.frozen([32, 64, 128, 256, 512, 1024, 2048, 4092]),
    quantizationValues: types.frozen(['16n', '16n', '8n', '8n', '4n', '4n', '1n', '1n']),
    samplesPerPixel: types.optional(types.number, 512),
    zoomIndex: types.optional(types.number, 4),
    bpm: types.optional(types.number, Tone.getTransport().bpm.value),
    timeSignature: types.optional(types.number, Tone.getTransport().timeSignature as number),
    totalMeasures: types.optional(types.number, 200),
    currentTrackId: types.optional(types.number, 1),
    scrollXOffsetPixels: types.optional(types.number, 0),
    clipboard: types.optional(types.array(ClipboardItem), []),
    tracks: types.optional(types.array(MST_Track), []),
    selectedTracks: types.optional(types.array(MST_Track), []),
    selectedClips: types.optional(types.array(MST_Clip), []),
    snap: types.optional(types.boolean, false),
    metronomeActive: types.optional(types.boolean, true),
    metronome: types.optional(types.model({}).volatile(() => new Tone.PluckSynth().toDestination()), metronome)
  })
  .views((self) => ({
    get samplesPerPixel() {
      return self.zoomLevels[self.zoomIndex];
    },

    get bpm() {
      return Tone.getTransport().bpm.value;
    },

    get timeSignature() {
      return Tone.getTransport().timeSignature;
    },
  }))
  .actions((self) => ({
    setState(newState: 'playing' | 'stopped' | 'paused' | 'recording') {
      self.state = newState;
    },
  
    setMetronome(value: boolean) {
      self.metronomeActive = value;
    },

    createTrack() {
      //const newTrack = new Track(self, self.currentTrackId, `Track ${self.tracks.length + 1}`);
      //self.tracks.push(newTrack);
      self.currentTrackId += 1;
    },
  
    setupMetronome() {
      Tone.getTransport().scheduleRepeat(time => {
        self.metronome?.triggerAttack('C5', time)
      }, "4n");
      this.createTrack();
      
    },
  
    toggleMetronome() {
      this.setMetronome(!self.metronomeActive);
      if (!self.metronomeActive) {
        self.metronome!.disconnect()
      } else {
        self.metronome!.toDestination()
      }
    },
  
    setSnap(value: boolean) {
      self.snap = value;
    },
  
    setZoom(direction: 'zoomIn' | 'zoomOut') {
      if (direction === 'zoomOut') {
        self.zoomIndex < self.zoomLevels.length -1 ? self.zoomIndex++ : self.zoomIndex = self.zoomLevels.length -1;
      } else {
        self.zoomIndex > 0 ? self.zoomIndex-- : self.zoomIndex = 0;
      }
      self.samplesPerPixel = self.zoomLevels[self.zoomIndex];
    },
  
    setBpm(bpm: number) {
      Tone.getTransport().bpm.value = bpm;
      self.bpm = bpm
    },
  
    setTimeSignature(value: number | number[]) {
      Tone.getTransport().timeSignature = value;
      self.timeSignature = Tone.getTransport().timeSignature as number;
    },
  
    getSelectedTracks() {
      //self.selectedTracks = [...self.tracks].filter(track => !!track.selected));
    },
  
    deselectAllTracks() {
      // self.tracks.forEach(track => track.deselect())
    },
  
    deleteSelectedTracks() {
      this.getSelectedTracks();
      // self.selectedTracks.forEach(track => track.channel.dispose())
      // const selectedTrackIds = self.selectedTracks.map(track => track.id);
      // self.tracks = self.tracks.filter(track => !selectedTrackIds.includes(track.id)),
      // self.selectedTracks = [],
    },
    
    setSelectedClips(clips: typeof MST_Clip[]) {
      // self.selectedClips = clips;
    },
  
    getSelectedClips() {
      // const selectedClips: Clip[] = [];
      // self.tracks.forEach(track => {
      //   track.clips.forEach((clip) => {
      //     if (clip.isSelected) {
      //       selectedClips.push(clip);
      //     }
      //   });
      // });
  
      // this.setSelectedClips(selectedClips);
    },
  
    moveSelectedClips(samples: number, direction: 'right' | 'left') {
      this.getSelectedClips();
      // if (direction === 'right') {
      //   self.selectedClips.forEach(clip => clip.setPosition(clip.start.toSamples() + samples))
      // } else {
      //   if (!self.selectedClips.find(clip => clip.start.toSamples() === 0)) {
      //     self.selectedClips.forEach(clip => clip.setPosition(clip.start.toSamples() - samples))
      //   }
      // }
    },
  
    quantizeSelectedClips() {
      self.selectedClips.forEach(clip => {
        // const quantizedTime = Tone.Time(clip.start.quantize(self.quantizationValues[self.zoomIndex])).toSamples();
        // clip.setPosition(quantizedTime)
      })
    },
  
    deleteSelectedClips() {
      this.getSelectedClips();
      // const clipIds = self.selectedClips.map(clip => clip.id);
      // self.tracks.forEach(track => {
      //   track.setClips(track.clips.filter((clip) => !clipIds.includes(clip.id)))
      // });
      // self.selectedClips.forEach(clip => clip.deleteClip());
    },
  
    splitSelectedClipsAtPlayhead() {
      this.getSelectedClips();
      self.selectedClips.forEach(clip => {
        // const currentTrack = clip.track;
        // const data = clip.split();
        // data && data.clips.forEach((clipData) => {
        //   const buffer = clipData.buffer.get();
        //   if (buffer) {
        //     const blob = new Blob([audioBufferToWav(buffer)], { type: "audio/wav" });
        //     currentTrack?.addClip(URL.createObjectURL(blob),  clipData.start.toSamples());
        //   }
        // })
        // currentTrack?.setClips(currentTrack.clips.filter(clip => clip.id !== data?.oldId));
      })
    },
  
    deselectClips() {
      this.getSelectedClips();
      // self.selectedClips.forEach(clip => clip.setSelect(false))
      this.setSelectedClips([])
    },
  
    copyClips() {
      // self.clipboard = self.selectedClips.map(clip => {
      //   const buffer = clip.audioBuffer.get();
      //   if (buffer) {
      //     return {
      //       data: new Blob([audioBufferToWav(buffer)], { type: "audio/wav" }),
      //       start: clip.start
      //     }
      //   }
      //   return null;
      // })
    },
  
    pasteClips() {
      if (self.selectedTracks.length > 0) {
        self.clipboard.forEach((item, i) => {
          // if (item?.data) {
          //   if (i > 0) {
          //     const adjustedStart = item.start.toSeconds() + Tone.getTransport().seconds;
          //     self.selectedTracks.forEach(track => track.addClip(URL.createObjectURL(item.data), adjustedStart));
          //   } else {
          //     self.selectedTracks.forEach(track => track.addClip(URL.createObjectURL(item.data), Tone.getTransport().seconds));
          //   }
          // }
        })
      }
    },

    play() {
      if (self.state !== 'playing') {
        // self.tracks.forEach(track => track.play());
        // Tone.getTransport().start()
      }
    },
  
    stop() {
      this.setState('stopped');
      Tone.getTransport().stop();
      // self.tracks.forEach(track => track.stop());
    },
  
    pause() {
      Tone.getTransport().pause();
      // self.tracks.forEach(track => track.stop())
      this.setState('paused');
    },
  
    setPosition(time: Tone.TimeClass, redraw: () => void) {
      const transport = Tone.getTransport();
      if (self.state === 'playing') {
      //   self.stop();
      //   transport.ticks = time.toTicks();
      //   self.play();
      // } else {
      //   transport.ticks = time.toTicks();
      //   redraw();
      }
    },
  
    startTone() {
      Tone.start();
    }
  }))