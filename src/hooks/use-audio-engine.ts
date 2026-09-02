/**
 * Web Audio API synthetic soundscape engine.
 * Generates procedural audio — no external files required.
 * Each chapter has its own sonic signature.
 */
import { useEffect, useRef, useCallback } from "react";

type ChapterSound =
  | "rosario"
  | "napkin"
  | "agony"
  | "farewell"
  | "immortality"
  | "silence";

interface AudioNode_ {
  stop?: () => void;
  disconnect?: () => void;
}

export function useAudioEngine(enabled = true) {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeNodes = useRef<AudioNode_[]>([]);
  const currentChapter = useRef<ChapterSound>("silence");

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [enabled]);

  const stopAll = useCallback(() => {
    activeNodes.current.forEach(node => {
      try { node.stop?.(); } catch (_) {}
      try { node.disconnect?.(); } catch (_) {}
    });
    activeNodes.current = [];
  }, []);

  // --- Noise generators ---
  const createNoise = useCallback((ctx: AudioContext, duration = 999, gainVal = 0.05): AudioBufferSourceNode => {
    const bufferSize = ctx.sampleRate * Math.min(duration, 4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = gainVal;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    return source;
  }, []);

  const createTone = useCallback((ctx: AudioContext, freq: number, gainVal = 0.05, type: OscillatorType = "sine"): OscillatorNode => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = gainVal;

    // Subtle LFO for organic movement
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return osc;
  }, []);

  const playRosarioAtmosphere = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAll();

    // Low rumble of street life
    const noise = createNoise(ctx, 999, 0.015);
    activeNodes.current.push(noise);

    // Clock ticking (metronome-like clicks)
    const interval = setInterval(() => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const clickBuf = c.createBuffer(1, c.sampleRate * 0.02, c.sampleRate);
      const d = clickBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 0.6 * Math.exp(-i / 200);
      const src = c.createBufferSource();
      src.buffer = clickBuf;
      const g = c.createGain();
      g.gain.value = 0.3;
      src.connect(g);
      g.connect(c.destination);
      src.start();
    }, 1200);

    // Store cleanup reference
    activeNodes.current.push({ stop: () => clearInterval(interval) });

    // Deep hollow drones
    const drone = createTone(ctx, 55, 0.02, "sine");
    activeNodes.current.push(drone);
  }, [getCtx, stopAll, createNoise, createTone]);

  const playNapkinAtmosphere = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAll();

    // Paper scratch simulation (filtered noise bursts)
    const noise = createNoise(ctx, 999, 0.008);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2000;
    noise.connect(filter);
    filter.connect(ctx.destination);
    activeNodes.current.push(noise);

    // Rising hopeful tone
    const tone = createTone(ctx, 220, 0.015, "sine");
    activeNodes.current.push(tone);
  }, [getCtx, stopAll, createNoise, createTone]);

  const playAgonyAtmosphere = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAll();

    // Rain — high-frequency noise
    const rain = createNoise(ctx, 999, 0.04);
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = "bandpass";
    rainFilter.frequency.value = 5000;
    rainFilter.Q.value = 0.5;
    rain.connect(rainFilter);
    rainFilter.connect(ctx.destination);
    activeNodes.current.push(rain);

    // Heavy low drone — stadium silence
    const drone = createTone(ctx, 40, 0.025, "sine");
    activeNodes.current.push(drone);

    // Occasional thunder bursts
    const thunder = setInterval(() => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const g = c.createGain();
      g.gain.setValueAtTime(0.3, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);

      const noise2 = createNoise(c, 2, 0.3);
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 200;
      noise2.connect(f);
      f.connect(g);
      g.connect(c.destination);
    }, 8000 + Math.random() * 5000);

    activeNodes.current.push({ stop: () => clearInterval(thunder) });
  }, [getCtx, stopAll, createNoise, createTone]);

  const playFarewellAtmosphere = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAll();

    // Camera shutters
    const shutters = setInterval(() => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const buf = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500);
      const src = c.createBufferSource();
      src.buffer = buf;
      const g = c.createGain();
      g.gain.value = 0.2;
      src.connect(g);
      g.connect(c.destination);
      src.start();
    }, 300 + Math.random() * 800);
    activeNodes.current.push({ stop: () => clearInterval(shutters) });

    // Mournful low tone
    const tone = createTone(ctx, 70, 0.02, "sine");
    activeNodes.current.push(tone);
  }, [getCtx, stopAll, createTone]);

  const playImmortalityAtmosphere = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAll();

    // Triumphant harmonics — simulated crowd
    const noise = createNoise(ctx, 999, 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    noise.connect(filter);
    filter.connect(ctx.destination);
    activeNodes.current.push(noise);

    // Triumphant chord stack
    [220, 277, 330, 440, 554].forEach((freq, i) => {
      const tone = createTone(ctx, freq, 0.012 - i * 0.001, "sine");
      activeNodes.current.push(tone);
    });
  }, [getCtx, stopAll, createNoise, createTone]);

  const playChapter = useCallback((chapter: ChapterSound) => {
    if (currentChapter.current === chapter) return;
    currentChapter.current = chapter;

    switch (chapter) {
      case "rosario": playRosarioAtmosphere(); break;
      case "napkin": playNapkinAtmosphere(); break;
      case "agony": playAgonyAtmosphere(); break;
      case "farewell": playFarewellAtmosphere(); break;
      case "immortality": playImmortalityAtmosphere(); break;
      case "silence": stopAll(); break;
    }
  }, [playRosarioAtmosphere, playNapkinAtmosphere, playAgonyAtmosphere, playFarewellAtmosphere, playImmortalityAtmosphere, stopAll]);

  useEffect(() => {
    return () => {
      stopAll();
      ctxRef.current?.close();
    };
  }, [stopAll]);

  return { playChapter };
}
