import { useEffect, useRef, useState } from "react";
import beepSound from "../assets/beep.mp3";
import blipSound from "../assets/blip.mp3";
import bootSequence from "../data/BootSequence";

export default function UseBootSequence() {
  const [phase, setPhase] = useState("idle");
  const [renderedLines, setRenderedLines] = useState([]);
  const startedRef = useRef(false);

  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(beepSound);
    beepRef.current.volume = 0.7;
  }, []);

  const playBeep = () => {
    const audio = beepRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const playBlip = () => {
    const audio = new Audio(blipSound);
    audio.volume = 0.35;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (phase !== "idle") return;

    const handleStart = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setPhase("booting-message");
    };

    window.addEventListener("keydown", handleStart);
    window.addEventListener("click", handleStart);

    return () => {
      window.removeEventListener("keydown", handleStart);
      window.removeEventListener("click", handleStart);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "booting-message") return;

    const timeout = setTimeout(() => {
      setPhase("sequence");
    }, 500);

    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "sequence") return;

    let cancelled = false;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const makeId = () => {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return `${Date.now()}-${Math.random()}`;
    };

    const runSequence = async () => {
      playBeep();
      await sleep(250);

      for (const step of bootSequence) {
        if (cancelled) return;

        if (step.type === "blank") {
          setRenderedLines((prev) => [...prev, { type: "blank" }]);
          await sleep(180);
          continue;
        }

        if (step.type === "line") {
          setRenderedLines((prev) => [...prev, { type: "line", text: step.text }]);
          playBlip();
          await sleep(220);
          continue;
        }

        if (step.type === "memory") {
          const lineId = makeId();

          setRenderedLines((prev) => [
            ...prev,
            {
              type: "memory",
              id: lineId,
              label: step.label,
              value: 0,
              done: false,
            },
          ]);

          playBlip();

          let current = 0;

          while (current < step.target) {
            if (cancelled) return;

            current = Math.min(current + step.step, step.target);

            setRenderedLines((prev) =>
              prev.map((line) =>
                line.id === lineId
                  ? { ...line, value: current, done: current >= step.target }
                  : line
              )
            );

            await sleep(step.interval);
          }

          await sleep(180);
          continue;
        }

        if (step.type === "detect") {
          const lineId = makeId();

          setRenderedLines((prev) => [
            ...prev,
            {
              type: "detect",
              id: lineId,
              left: step.left,
              dots: step.dots,
              right: "",
            },
          ]);

          playBlip();

          await sleep(step.delay);

          setRenderedLines((prev) =>
            prev.map((line) =>
              line.id === lineId ? { ...line, right: step.right } : line
            )
          );

          playBlip();

          await sleep(220);
          continue;
        }

        if (step.type === "finalSequence") {
          const initId = makeId();
          const spinnerId = makeId();
          const bootId = makeId();

          setRenderedLines((prev) => [
            ...prev,
            {
              type: "animatedDots",
              id: initId,
              prefix: "Initialization finished",
              dots: "",
              suffix: "",
            },
          ]);

          playBlip();

          for (let i = 0; i < 10; i++) {
            if (cancelled) return;
            await sleep(120);

            setRenderedLines((prev) =>
              prev.map((line) =>
                line.id === initId
                  ? { ...line, dots: ".".repeat(i + 1) }
                  : line
              )
            );
          }

          await sleep(200);

          setRenderedLines((prev) => [
            ...prev,
            {
              type: "spinnerStatus",
              id: spinnerId,
              prefix: "Activating root access ",
              spinner: "/",
              suffix: "",
            },
          ]);

          playBlip();

          const spinnerFrames = ["/", "-", "\\", "|"];
          const spinnerDuration = 1000;
          const spinnerInterval = 100;
          const ticks = spinnerDuration / spinnerInterval;

          for (let i = 0; i < ticks; i++) {
            if (cancelled) return;
            await sleep(spinnerInterval);

            setRenderedLines((prev) =>
              prev.map((line) =>
                line.id === spinnerId
                  ? { ...line, spinner: spinnerFrames[i % spinnerFrames.length] }
                  : line
              )
            );
          }

          setRenderedLines((prev) =>
            prev.map((line) =>
              line.id === spinnerId
                ? { ...line, spinner: "", suffix: "SUCCESS!" }
                : line
            )
          );

          playBlip();

          await sleep(250);

          setRenderedLines((prev) => [
            ...prev,
            {
              type: "animatedDots",
              id: bootId,
              prefix: "Beginning PORTFOLIO_OS boot sequence",
              dots: "",
              suffix: "",
            },
          ]);

          playBlip();

          for (let i = 0; i < 13; i++) {
            if (cancelled) return;
            await sleep(120);

            setRenderedLines((prev) =>
              prev.map((line) =>
                line.id === bootId
                  ? { ...line, dots: ".".repeat(i + 1) }
                  : line
              )
            );
          }

          await sleep(900);
        }
      }

      setPhase("done");
    };

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  return {
    phase,
    renderedLines,
  };
}