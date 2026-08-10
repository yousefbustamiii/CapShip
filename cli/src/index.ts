import { printBanner } from "./ui/banner.js";
import { runFree } from "./commands/free.js";
import { runPro } from "./commands/pro.js";

process.on("SIGINT", () => {
  console.log();
  process.exit(0);
});

const [command, licenseArg] = process.argv.slice(2) as [string | undefined, string | undefined];

printBanner();

if (command === "free") {
  await runFree();
} else if (command === "pro") {
  await runPro(licenseArg);
} else {
  console.log("  Usage:");
  console.log();
  console.log("    npx capship free");
  console.log("    npx capship pro [license-key]");
  console.log();
  process.exit(1);
}
