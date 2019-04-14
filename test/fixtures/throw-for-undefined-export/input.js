import { EXPORT_A, EXPORT_B, EXPORT_X } from "./module";

if (EXPORT_A) {
  console.log("EXPORT_A");
}
if (EXPORT_B === "b") {
  console.log("EXPORT_B");
}

const t = EXPORT_X;