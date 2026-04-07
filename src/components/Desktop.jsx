import { useState } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import TerminalWindow from "./TerminalWindow";
import BrowserWindow from "./BrowserWindow";
import ExplorerWindow from "./ExplorerWindow";

import cliIcon from "../assets/cli.png";
import browserIcon from "../assets/browser.png";
import explorerIcon from "../assets/explorer.png";
import backgroundImage from "../assets/backgr.png";

export default function Desktop() {
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [terminalZ, setTerminalZ] = useState(3);

  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerMinimized, setExplorerMinimized] = useState(false);
  const [explorerZ, setExplorerZ] = useState(2);

  const [browserWindows, setBrowserWindows] = useState([]);
  const [zCounter, setZCounter] = useState(10);

  const nextZ = () => {
    const newZ = zCounter + 1;
    setZCounter(newZ);
    return newZ;
  };

  const focusTerminal = () => {
    setTerminalZ(nextZ());
  };

  const focusExplorer = () => {
    setExplorerZ(nextZ());
  };

  const focusBrowser = (id) => {
    const newZ = nextZ();
    setBrowserWindows((prev) =>
      prev.map((browser) =>
        browser.id === id ? { ...browser, zIndex: newZ } : browser
      )
    );
  };

  const handleOpenTerminal = () => {
    setTerminalOpen(true);
    setTerminalMinimized(false);
    focusTerminal();
  };

  const handleOpenExplorer = () => {
    setExplorerOpen(true);
    setExplorerMinimized(false);
    focusExplorer();
  };

  const handleOpenBrowser = () => {
    const newBrowser = {
      id: Date.now() + Math.random(),
      file: {
        name: "index.html",
        page: "home",
      },
      minimized: false,
      zIndex: nextZ(),
    };

    setBrowserWindows((prev) => [...prev, newBrowser]);
  };

  const handleOpenFile = (file) => {
    const newBrowser = {
      id: Date.now() + Math.random(),
      file,
      minimized: false,
      zIndex: nextZ(),
    };

    setBrowserWindows((prev) => [...prev, newBrowser]);
  };

  const handleCloseBrowser = (id) => {
    setBrowserWindows((prev) => prev.filter((browser) => browser.id !== id));
  };

  const handleMinimizeBrowser = (id) => {
    setBrowserWindows((prev) =>
      prev.map((browser) =>
        browser.id === id ? { ...browser, minimized: true } : browser
      )
    );
  };

  const handleRestoreBrowser = (id) => {
    const newZ = nextZ();
    setBrowserWindows((prev) =>
      prev.map((browser) =>
        browser.id === id
          ? { ...browser, minimized: false, zIndex: newZ }
          : browser
      )
    );
  };

  return (
    <div
      className="desktop"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="desktop-icons">
        <DesktopIcon
          label="Command Line"
          icon={cliIcon}
          onDoubleClick={handleOpenTerminal}
        />
        <DesktopIcon
          label="Browser"
          icon={browserIcon}
          onDoubleClick={handleOpenBrowser}
        />
        <DesktopIcon
          label="Documents"
          icon={explorerIcon}
          onDoubleClick={handleOpenExplorer}
          large
        />
      </div>

      {terminalOpen && !terminalMinimized && (
        <TerminalWindow
          zIndex={terminalZ}
          onFocus={focusTerminal}
          onClose={() => {
            setTerminalOpen(false);
            setTerminalMinimized(false);
          }}
          onMinimize={() => setTerminalMinimized(true)}
          onOpenFile={handleOpenFile}
        />
      )}

      {explorerOpen && !explorerMinimized && (
        <ExplorerWindow
          zIndex={explorerZ}
          onFocus={focusExplorer}
          onClose={() => {
            setExplorerOpen(false);
            setExplorerMinimized(false);
          }}
          onMinimize={() => setExplorerMinimized(true)}
          onOpenFile={handleOpenFile}
        />
      )}

      {browserWindows
        .filter((browser) => !browser.minimized)
        .map((browser) => (
          <BrowserWindow
            key={browser.id}
            currentFile={browser.file}
            zIndex={browser.zIndex}
            onFocus={() => focusBrowser(browser.id)}
            onClose={() => handleCloseBrowser(browser.id)}
            onMinimize={() => handleMinimizeBrowser(browser.id)}
          />
        ))}

      <Taskbar
        terminalOpen={terminalOpen}
        terminalMinimized={terminalMinimized}
        explorerOpen={explorerOpen}
        explorerMinimized={explorerMinimized}
        browserWindows={browserWindows}
        onTerminalClick={handleOpenTerminal}
        onExplorerClick={handleOpenExplorer}
        onBrowserClick={handleRestoreBrowser}
      />
    </div>
  );
}