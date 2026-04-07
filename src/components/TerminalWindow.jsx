import { useMemo, useState } from "react";
import WindowFrame from "./WindowFrame";
import FileSystem from "../data/FileSystem";

function getDirectoryFromPath(path) {
  const root = FileSystem["C:\\"];
  if (path === "C:\\") return root;

  const parts = path.replace("C:\\", "").split("\\").filter(Boolean);
  let current = root;

  for (const part of parts) {
    if (!current.children) return null;

    const key = Object.keys(current.children).find(
      (k) => k.toLowerCase() === part.toLowerCase()
    );

    if (!key) return null;
    current = current.children[key];
  }

  return current;
}

function listDirectory(path) {
  const dir = getDirectoryFromPath(path);
  if (!dir || dir.type !== "directory") return [];
  return Object.entries(dir.children).map(([name, value]) => ({
    name,
    type: value.type,
    page: value.page || null,
  }));
}

export default function TerminalWindow({
  onClose,
  onMinimize,
  onOpenFile,
  onFocus,
  zIndex,
}) {
  const [currentPath, setCurrentPath] = useState("C:\\");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "COMPIOTREK Command Line v1.0",
    "Type HELP to list available commands.",
    "",
  ]);

  const entries = useMemo(() => listDirectory(currentPath), [currentPath]);

  const pushHistory = (lines) => {
    setHistory((prev) => [...prev, ...(Array.isArray(lines) ? lines : [lines])]);
  };

  const handleCommand = (rawInput) => {
    const trimmed = rawInput.trim();

    if (!trimmed) {
      pushHistory(`${currentPath}>`);
      return;
    }

    pushHistory(`${currentPath}> ${trimmed}`);

    const [command, ...args] = trimmed.split(" ");
    const normalized = command.toLowerCase();
    const argString = args.join(" ").trim();

    if (normalized === "help") {
      pushHistory([
        "Available commands:",
        "help",
        "ls",
        "dir",
        "pwd",
        "cd Documents",
        "cd ..",
        "open <filename>",
        "clear",
      ]);
      return;
    }

    if (normalized === "ls" || normalized === "dir") {
      if (entries.length === 0) {
        pushHistory("Directory is empty.");
        return;
      }

      pushHistory(
        entries.map((entry) =>
          entry.type === "directory" ? `[DIR] ${entry.name}` : entry.name
        )
      );
      return;
    }

    if (normalized === "pwd") {
      pushHistory(currentPath);
      return;
    }

    if (normalized === "cd") {
      if (!argString) {
        pushHistory("Usage: cd <directory>");
        return;
      }

      if (argString === "..") {
        if (currentPath === "C:\\") {
          pushHistory("Already at root.");
          return;
        }

        const trimmedPath = currentPath.endsWith("\\")
          ? currentPath.slice(0, -1)
          : currentPath;

        const parts = trimmedPath.split("\\");
        parts.pop();

        const newPath =
          parts.length <= 1 ? "C:\\" : `${parts.join("\\")}\\`;

        setCurrentPath(newPath);
        return;
      }

      const dir = getDirectoryFromPath(currentPath);
      if (!dir || !dir.children) {
        pushHistory("Current directory is invalid.");
        return;
      }

      const matchKey = Object.keys(dir.children).find(
        (key) => key.toLowerCase() === argString.toLowerCase()
      );

      if (!matchKey) {
        pushHistory(`Directory not found: ${argString}`);
        return;
      }

      const next = dir.children[matchKey];
      if (next.type !== "directory") {
        pushHistory(`${matchKey} is not a directory.`);
        return;
      }

      const newPath =
        currentPath === "C:\\"
          ? `C:\\${matchKey}`
          : `${currentPath}\\${matchKey}`;

      setCurrentPath(newPath);
      return;
    }

    if (normalized === "open") {
      if (!argString) {
        pushHistory("Usage: open <filename>");
        return;
      }

      const dir = getDirectoryFromPath(currentPath);
      if (!dir || !dir.children) {
        pushHistory("Current directory is invalid.");
        return;
      }

      const matchKey = Object.keys(dir.children).find(
        (key) => key.toLowerCase() === argString.toLowerCase()
      );

      if (!matchKey) {
        pushHistory(`File not found: ${argString}`);
        return;
      }

      const file = dir.children[matchKey];
      if (file.type !== "file") {
        pushHistory(`${matchKey} is not a file.`);
        return;
      }

      onOpenFile?.({
        name: matchKey,
        page: file.page,
      });

      pushHistory(`Opening ${matchKey}...`);
      return;
    }

    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    pushHistory(`Unknown command: ${command}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCommand(input);
    setInput("");
  };

  return (
    <WindowFrame
      title="Command Line"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      zIndex={zIndex}
      className="terminal-window"
    >
      <div className="terminal-screen">
        {history.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <form className="terminal-input-row" onSubmit={handleSubmit}>
          <span className="terminal-prompt">{currentPath}&gt;</span>
          <input
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </WindowFrame>
  );
}