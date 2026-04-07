import WindowFrame from "./WindowFrame";
import FileSystem from "../data/FileSystem";

export default function ExplorerWindow({
  onClose,
  onMinimize,
  onOpenFile,
  onFocus,
  zIndex,
}) {
  const documents = Object.entries(FileSystem["C:\\"].children.Documents.children).map(
    ([name, value]) => ({
      name,
      page: value.page,
    })
  );

  return (
    <WindowFrame
      title="Documents"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      zIndex={zIndex}
      className="explorer-window"
    >
      <div className="explorer-window-content">
        <div className="explorer-toolbar">
          <button className="browser-nav-button">Back</button>
          <button className="browser-nav-button">Up</button>
          <div className="explorer-address-bar">C:\Documents</div>
        </div>

        <div className="explorer-list">
          {documents.map((file) => (
            <button
              key={file.name}
              className="explorer-file"
              onDoubleClick={() => onOpenFile(file)}
            >
              <div className="explorer-file-icon" />
              <span className="explorer-file-name">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}