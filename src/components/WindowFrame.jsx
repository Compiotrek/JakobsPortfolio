import { useRef, useState } from "react";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;
const TASKBAR_HEIGHT = 40;

export default function WindowFrame({
  title,
  onClose,
  onMinimize,
  onFocus,
  zIndex = 1,
  children,
  className = "",
}) {
  const [position, setPosition] = useState({ x: 160, y: 90 });
  const [size, setSize] = useState({ width: 620, height: 420 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState({
    x: 160,
    y: 90,
    width: 620,
    height: 420,
  });

  const dragData = useRef({
    offsetX: 0,
    offsetY: 0,
  });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleMouseDown = (event) => {
    onFocus?.();
    if (isMaximized) return;

    dragData.current.offsetX = event.clientX - position.x;
    dragData.current.offsetY = event.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - TASKBAR_HEIGHT - size.height;

      const newX = clamp(
        moveEvent.clientX - dragData.current.offsetX,
        0,
        Math.max(0, maxX)
      );
      const newY = clamp(
        moveEvent.clientY - dragData.current.offsetY,
        0,
        Math.max(0, maxY)
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleToggleMaximize = () => {
    onFocus?.();

    if (!isMaximized) {
      setPreviousState({
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      });
      setIsMaximized(true);
      return;
    }

    setPosition({
      x: previousState.x,
      y: previousState.y,
    });
    setSize({
      width: previousState.width,
      height: previousState.height,
    });
    setIsMaximized(false);
  };

  const startResize = (direction, event) => {
    event.stopPropagation();
    onFocus?.();
    if (isMaximized) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes("right")) {
        newWidth = clamp(
          startWidth + dx,
          MIN_WIDTH,
          window.innerWidth - startLeft
        );
      }

      if (direction.includes("bottom")) {
        newHeight = clamp(
          startHeight + dy,
          MIN_HEIGHT,
          window.innerHeight - TASKBAR_HEIGHT - startTop
        );
      }

      if (direction.includes("left")) {
        const rawWidth = startWidth - dx;
        const clampedWidth = clamp(rawWidth, MIN_WIDTH, startLeft + startWidth);
        newWidth = clampedWidth;
        newX = startLeft + (startWidth - clampedWidth);
        newX = Math.max(0, newX);

        if (newX === 0) {
          newWidth = startLeft + startWidth;
        }
      }

      if (direction.includes("top")) {
        const rawHeight = startHeight - dy;
        const clampedHeight = clamp(rawHeight, MIN_HEIGHT, startTop + startHeight);
        newHeight = clampedHeight;
        newY = startTop + (startHeight - clampedHeight);
        newY = Math.max(0, newY);

        if (newY === 0) {
          newHeight = startTop + startHeight;
        }
      }

      setPosition({ x: newX, y: newY });
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 0,
        width: "100vw",
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        zIndex,
      }
    : {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      };

  return (
    <div
      className={`window-frame ${className} ${isMaximized ? "maximized" : ""}`}
      style={windowStyle}
      onMouseDown={() => onFocus?.()}
    >
      {!isMaximized && (
        <>
          <div className="resize-handle resize-handle-top" onMouseDown={(e) => startResize("top", e)} />
          <div className="resize-handle resize-handle-right" onMouseDown={(e) => startResize("right", e)} />
          <div className="resize-handle resize-handle-bottom" onMouseDown={(e) => startResize("bottom", e)} />
          <div className="resize-handle resize-handle-left" onMouseDown={(e) => startResize("left", e)} />

          <div className="resize-handle resize-handle-top-left" onMouseDown={(e) => startResize("top-left", e)} />
          <div className="resize-handle resize-handle-top-right" onMouseDown={(e) => startResize("top-right", e)} />
          <div className="resize-handle resize-handle-bottom-right" onMouseDown={(e) => startResize("bottom-right", e)} />
          <div className="resize-handle resize-handle-bottom-left" onMouseDown={(e) => startResize("bottom-left", e)} />
        </>
      )}

      <div
        className="window-titlebar"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleToggleMaximize}
      >
        <span className="window-title">{title}</span>

        <div className="window-controls">
          <button
            className="window-control"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
          >
            _
          </button>

          <button
            className="window-control"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMaximize();
            }}
          >
            {isMaximized ? "❐" : "□"}
          </button>

          <button
            className="window-control close"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="window-body">{children}</div>
    </div>
  );
}