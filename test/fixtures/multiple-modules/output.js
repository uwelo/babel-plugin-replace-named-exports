import { IGNORE } from "other-module";

if (true) {
  console.log("EXPORT_A");
}

if ("b" === "b") {
  console.log("EXPORT_B");
}

if ("de" === "de") {
  console.log("EXPORT");
}

if (IGNORE) {
  console.log("IGNORE");
}