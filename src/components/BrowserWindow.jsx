import WindowFrame from "./WindowFrame";

const pageContent = {
  home: {
    title: "COMPIOTREK",
    body: "Welcome to my retro portfolio system.",
  },
  about: {
    title: "About",
    body: "This page will later show information about me.",
  },
  projects: {
    title: "Projects",
    body: "This page will later list my projects.",
  },
  "linear-regression": {
    title: "Linear Regression",
    body: "This page will later show the Linear Regression project.",
  },
};

export default function BrowserWindow({
  onClose,
  onMinimize,
  currentFile,
  onFocus,
  zIndex,
}) {
  const fallbackFile = { name: "index.html", page: "home" };
  const activeFile = currentFile || fallbackFile;
  const content = pageContent[activeFile.page] || pageContent.home;

  return (
    <WindowFrame
      title="Browser"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      zIndex={zIndex}
      className="browser-window"
    >
      <div className="browser-chrome">
        <div className="browser-toolbar">
          <button className="browser-nav-button">←</button>
          <button className="browser-nav-button">→</button>
          <button className="browser-nav-button">⟳</button>
          <div className="browser-address-bar">{`C:\\Documents\\${activeFile.name}`}</div>
        </div>

        <div className="browser-page">
          <h1>{content.title}</h1>
          <p>{content.body}</p>
        </div>
      </div>
    </WindowFrame>
  );
}