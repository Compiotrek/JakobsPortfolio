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
  "document-workflow-intelligence": {
    title: "Gmail & Document Workflow Intelligence",
    body: (
      <div className="project-detail" style={{ fontFamily: "sans-serif", fontSize: "14px", lineHeight: "1.5" }}>
        <p style={{ fontSize: "15px", fontWeight: "bold", color: "#444", margin: "0 0 16px 0" }}>
          Local-first AI-assisted workflow automation prototype for turning Gmail messages, PDFs and TXT documents into prioritized, reviewable workflow actions.
        </p>

        <h3 style={{ borderBottom: "2px solid #808080", paddingBottom: "4px", margin: "20px 0 10px 0", fontSize: "16px" }}>Description</h3>
        <p style={{ margin: "0 0 16px 0" }}>
          The project analyzes Gmail messages and local documents,
          extracts structured workflow items such as tasks, risks, questions, decisions, and ideas, prioritizes them,
          and groups related actions into reviewable Email Action Bundles. The focus is on human-in-the-loop automation: the system provides suggestions,
          but does not send emails or create calendar events automatically.
        </p>

        <h3 style={{ borderBottom: "2px solid #808080", paddingBottom: "4px", margin: "20px 0 10px 0", fontSize: "16px" }}>Key Features</h3>
        <ul style={{ paddingLeft: "20px", margin: "0 0 16px 0" }}>
          <li>Read-only Gmail integration via OAuth</li>
          <li>PDF/TXT document upload</li>
          <li>TF-IDF search and semantic retrieval</li>
          <li>Workflow item extraction</li>
          <li>Task, risk, question, decision and idea classification</li>
          <li>Priority scoring</li>
          <li>Email Action Bundles</li>
          <li>Automation dashboard</li>
          <li>Calendar suggestions as .ics exports</li>
          <li>Local reply draft suggestions</li>
          <li>Local-first architecture with privacy focus</li>
          <li>Optional Ollama / local LLM enhancement</li>
        </ul>

        <h3 style={{ borderBottom: "2px solid #808080", paddingBottom: "4px", margin: "20px 0 10px 0", fontSize: "16px" }}>Tech Stack</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "0 0 24px 0" }}>
          {["Python", "Streamlit", "scikit-learn", "LangChain", "FAISS", "Ollama optional", "Google OAuth / Gmail read-only", "PDF/TXT processing"].map((tech) => (
            <span
              key={tech}
              style={{
                background: "#e0e0e0",
                border: "1px solid #808080",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "3px"
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <a
            href="https://github.com/Compiotrek/document-and-inbox-workflow-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#c0c0c0",
              color: "black",
              padding: "8px 16px",
              textDecoration: "none",
              fontWeight: "bold",
              borderTop: "2px solid #ffffff",
              borderLeft: "2px solid #ffffff",
              borderRight: "2px solid #404040",
              borderBottom: "2px solid #404040",
              fontSize: "13px",
              boxShadow: "1px 1px 0 #000000"
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.borderTop = "2px solid #404040";
              e.currentTarget.style.borderLeft = "2px solid #404040";
              e.currentTarget.style.borderRight = "2px solid #ffffff";
              e.currentTarget.style.borderBottom = "2px solid #ffffff";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.borderTop = "2px solid #ffffff";
              e.currentTarget.style.borderLeft = "2px solid #ffffff";
              e.currentTarget.style.borderRight = "2px solid #404040";
              e.currentTarget.style.borderBottom = "2px solid #404040";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderTop = "2px solid #ffffff";
              e.currentTarget.style.borderLeft = "2px solid #ffffff";
              e.currentTarget.style.borderRight = "2px solid #404040";
              e.currentTarget.style.borderBottom = "2px solid #404040";
            }}
          >
            Open GitHub Repository
          </a>
        </div>
      </div>
    ),
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
          <h1 style={{ fontFamily: "sans-serif", fontSize: "22px", margin: "0 0 16px 0", borderBottom: "3px double #808080", paddingBottom: "6px" }}>
            {content.title}
          </h1>
          {typeof content.body === "string" ? (
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", lineHeight: "1.5" }}>{content.body}</p>
          ) : (
            content.body
          )}
        </div>
      </div>
    </WindowFrame>
  );
}