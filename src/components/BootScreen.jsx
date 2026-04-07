import logo from "../assets/Compiotrek2.png";

export default function BootScreen({ phase, renderedLines }) {
  const showBootLogo = phase === "sequence";

  return (
    <div className="boot-screen">
      {showBootLogo && (
        <img src={logo} alt="Compiotrek logo" className="boot-logo" />
      )}

      <div className="boot-content">
        {phase === "idle" && (
          <p className="boot-line">
            Press any key to start
            <span className="cursor">_</span>
          </p>
        )}

        {phase === "booting-message" && (
          <p className="boot-line">
            Booting System...
            <span className="cursor">_</span>
          </p>
        )}

        {(phase === "sequence" || phase === "done") && (
          <>
            {renderedLines.map((line, index) => {
              if (line.type === "blank") {
                return <div key={`blank-${index}`} className="boot-spacer" />;
              }

              if (line.type === "line") {
                return (
                  <p className="boot-line" key={`line-${index}`}>
                    {line.text}
                  </p>
                );
              }

              if (line.type === "memory") {
                return (
                  <p className="boot-line" key={line.id}>
                    {line.label} {line.value}K {line.done ? "OK" : ""}
                  </p>
                );
              }

              if (line.type === "detect") {
                return (
                  <p className="boot-line detect-line" key={line.id}>
                    <span className="detect-left">{line.left}</span>
                    <span className="detect-dots">{line.dots}</span>
                    <span className="detect-right">{line.right}</span>
                  </p>
                );
              }

              if (line.type === "animatedDots") {
                return (
                  <p className="boot-line" key={line.id}>
                    {line.prefix}
                    {line.dots}
                    {line.suffix ? ` ${line.suffix}` : ""}
                  </p>
                );
              }

              if (line.type === "spinnerStatus") {
                return (
                  <p className="boot-line" key={line.id}>
                    {line.prefix}
                    <span className="spinner-slot">{line.spinner || " "}</span>
                    {line.suffix ? ` ${line.suffix}` : ""}
                  </p>
                );
              }

              return null;
            })}

            {phase === "sequence" && <span className="cursor">_</span>}
          </>
        )}
      </div>
    </div>
  );
}