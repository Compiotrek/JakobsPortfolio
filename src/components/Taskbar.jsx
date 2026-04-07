import { useEffect, useState } from "react";

export default function Taskbar({
  terminalOpen,
  terminalMinimized,
  explorerOpen,
  explorerMinimized,
  browserWindows,
  onTerminalClick,
  onExplorerClick,
  onBrowserClick,
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="taskbar">
      <button className="start-button">Start</button>

      <div className="taskbar-windows">
        {terminalOpen && (
          <button className="taskbar-window-button" onClick={onTerminalClick}>
            {terminalMinimized ? "[ ] " : ""}
            Command Line
          </button>
        )}

        {explorerOpen && (
          <button className="taskbar-window-button" onClick={onExplorerClick}>
            {explorerMinimized ? "[ ] " : ""}
            Documents
          </button>
        )}

        {browserWindows.map((browser, index) => (
          <button
            key={browser.id}
            className="taskbar-window-button"
            onClick={() => onBrowserClick(browser.id)}
          >
            {browser.minimized ? "[ ] " : ""}
            {browser.file?.name || `Browser ${index + 1}`}
          </button>
        ))}
      </div>

      <div className="taskbar-clock">{time}</div>
    </div>
  );
}