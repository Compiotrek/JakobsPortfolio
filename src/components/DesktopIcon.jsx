export default function DesktopIcon({ label, icon, onDoubleClick, large = false }) {
  return (
    <button className="desktop-icon" onDoubleClick={onDoubleClick}>
      <img
        src={icon}
        alt={label}
        className={`desktop-icon-image ${large ? "desktop-icon-image-large" : ""}`}
      />
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}