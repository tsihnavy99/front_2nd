module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost:3000"],
      numberOfRuns: 5,
    },
  },
};
