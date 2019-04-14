import { EXPORT_A, EXPORT_B, EXPORT_C as exportC } from "module";

if (EXPORT_A) {
  console.log("EXPORT_A");
}
if (EXPORT_B === "b") {
  console.log("EXPORT_B");
}
if (exportC) {
  console.log("EXPORT_C");
}

const replace = `a${EXPORT_B}c`
const ignore = `a${EXPORT_B_C}c`