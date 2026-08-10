import * as clack from "@clack/prompts";
import kleur from "kleur";

import { redeemLicense } from "../lib/api.js";
import { downloadAndExtract } from "../lib/extract.js";

export async function runPro(licenseArg?: string): Promise<void> {
  let licenseKey: string;

  if (licenseArg) {
    licenseKey = licenseArg.trim();
  } else {
    const input = await clack.password({
      message: "Enter your CapShip Pro license",
      validate: (value) => {
        if (!value || value.trim().length < 10) return "Please enter a valid license key";
      },
    });

    if (clack.isCancel(input)) {
      clack.cancel("Cancelled.");
      process.exit(0);
    }

    licenseKey = input.trim();
  }

  const verifySpinner = clack.spinner();
  verifySpinner.start("Verifying license");

  let downloadUrl: string;

  try {
    downloadUrl = await redeemLicense(licenseKey);
  } catch (err) {
    verifySpinner.stop("Verification failed");
    clack.log.error(err instanceof Error ? err.message : "License verification failed");
    process.exit(1);
  }

  verifySpinner.stop(kleur.green("License verified ✓"));

  console.log();

  const downloadSpinner = clack.spinner();
  downloadSpinner.start("Preparing CapShip Pro");

  try {
    await downloadAndExtract(downloadUrl, process.cwd());
  } catch (err) {
    downloadSpinner.stop("Download failed");
    clack.log.error(err instanceof Error ? err.message : "Download failed");
    process.exit(1);
  }

  downloadSpinner.stop("Preparing CapShip Pro");

  console.log();
  clack.log.success("Downloading CapShip Pro");
  clack.log.success("Creating ./client");
  clack.log.success("Configuring Capacitor");
  clack.log.success("Setting up iOS");
  clack.log.success("Setting up Android");
  clack.log.success("Installing Pro modules");

  console.log();
  console.log("  " + kleur.bold("Next steps:"));
  console.log();
  console.log("  " + kleur.cyan("Please follow the README.md in the project root to get started."));
  console.log();
  console.log("  Start developing:");
  console.log();
  console.log("  " + kleur.dim("npm run dev"));
  console.log();
  console.log("  Open native projects:");
  console.log();
  console.log("  " + kleur.dim("npx cap open ios"));
  console.log("  " + kleur.dim("npx cap open android"));
  console.log();
  console.log("  " + kleur.dim("─".repeat(43)));
  console.log();
  console.log("  " + kleur.green("CapShip Pro activated ✓"));
  console.log();
  console.log("  " + kleur.dim("Build your app. We'll handle the foundation."));
  console.log();
  console.log("  " + kleur.blue().underline("capship.org/what-you-get"));
  console.log();
  clack.outro(kleur.green("Happy shipping ✓"));
}
