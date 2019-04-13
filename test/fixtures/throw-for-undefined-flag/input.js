import { FEATURE_A, FEATURE_B, FEATURE_X } from "./config/featureFlags";

if (FEATURE_A) {
  console.log("FEATURE_A");
}
if (FEATURE_B === "b") {
  console.log("FEATURE_B");
}