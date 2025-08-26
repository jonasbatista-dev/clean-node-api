// .lintstagedrc.js
export default {
  "*.{js,ts}": (filenames) => [
    `npx prettier --write ${filenames.map((f) => `"${f}"`).join(" ")}`,
    `npm run lint:fix`,
    // `npm run test -- --findRelatedTests ${filenames
    //   .map((f) => `"${f}"`)
    //   .join(' ')}`,
  ],
};
