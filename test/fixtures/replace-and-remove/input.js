import { FEATURE_A, FEATURE_B } from "featureFlags";

if (FEATURE_A) {
  console.log("FEATURE_A");
}
if (FEATURE_B === "b") {
  console.log("FEATURE_B");
}

const replace = `a${FEATURE_B}c`
const ignore = `a${FEATURE_B_C}c`