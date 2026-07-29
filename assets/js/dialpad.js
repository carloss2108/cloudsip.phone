import { state } from "./state.js";
import { updateNumberDisplay } from "./ui.js";
import { startCall } from "./call-manager.js";
import { playDtmfTone } from "./sound-manager.js";

function isTypingTarget(target) {
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function appendDialKey(key) {
  state.typed += key;
  updateNumberDisplay(state);
}

function isToneKey(key) {
  return /^[0-9*#]$/.test(key);
}

function isDialKey(key) {
  return /^[0-9A-Za-z*#+_]$/.test(key);
}

function handleDialKey(key) {
  const dialKey = String(key || "").toLowerCase();
  appendDialKey(dialKey);
  if (isToneKey(dialKey)) playDtmfTone(dialKey);
}

function handleStartCall() {
  if (!state.typed) return;
  startCall();
}

export function updateDialModeUI() {
  updateNumberDisplay(state);
}

export function initDialpad() {
  document.addEventListener("click", (e) => {
    const key = e.target.closest("[data-key]");
    if (!key) return;

    handleDialKey(key.dataset.key);
  });

  document.addEventListener("keydown", (event) => {
    if (isTypingTarget(event.target)) return;

    const key = event.key;

    if (isDialKey(key)) {
      event.preventDefault();
      handleDialKey(key);
      return;
    }

    if (key === "Backspace") {
      event.preventDefault();
      state.typed = state.typed.slice(0, -1);
      updateNumberDisplay(state);
      return;
    }

    if (key === "Delete" || key === "Escape") {
      event.preventDefault();
      state.typed = "";
      updateNumberDisplay(state);
      return;
    }

    if (key === "Enter") {
      event.preventDefault();
      handleStartCall();
    }
  });

  document.addEventListener("viewchange", (event) => {
    if (event.detail?.view === "dial") updateDialModeUI();
  });

  document.getElementById("backspaceBtn").addEventListener("click", () => {
    state.typed = state.typed.slice(0, -1);
    updateNumberDisplay(state);
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    state.typed = "";
    updateNumberDisplay(state);
  });

  document
    .getElementById("startCall")
    .addEventListener("click", handleStartCall);
  updateDialModeUI();
}
