import { EXPORT_A, EXPORT_B } from "module";
import { EXPORT } from "second-module";
import { IGNORE } from "other-module";

if (EXPORT_A) {
  console.log("EXPORT_A");
}

if (EXPORT_B === "b") {
  console.log("EXPORT_B");
}

if (EXPORT === "de") {
  console.log("EXPORT");
}

if (IGNORE) {
  console.log("IGNORE");
}