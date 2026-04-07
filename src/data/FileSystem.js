const FileSystem = {
  "C:\\": {
    type: "directory",
    children: {
      Documents: {
        type: "directory",
        children: {
          "index.html": { type: "file", page: "home" },
          "about.html": { type: "file", page: "about" },
          "projects.html": { type: "file", page: "projects" },
          "LinearRegression.html": {
            type: "file",
            page: "linear-regression",
          },
        },
      },
    },
  },
};

export default FileSystem;