module.exports = {
  ci: {
    collect: {
      staticDistDir: "./packages/assignment-6/dist",
      url: ["http://localhost:3000"],
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci_reports",
    },
  },
};
