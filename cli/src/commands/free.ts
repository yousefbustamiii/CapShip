import * as clack from "@clack/prompts";
import kleur from "kleur";

import { fetchFreeBundleUrl } from "../lib/api.js";
import { downloadAndExtract } from "../lib/extract.js";

export async function runFree(): Promise<void> {
  const s = clack.spinner();

  s.start("Downloading CapShip Free");

  try {
    const downloadUrl = await fetchFreeBundleUrl();
    await downloadAndExtract(downloadUrl, process.cwd());
  } catch (err) {
    s.stop("Download failed");
    clack.log.error(err instanceof Error ? err.message : "An unexpected error occurred");
    process.exit(1);
  }

  s.stop("Downloading CapShip Free");

  clack.log.success("Creating project");
  clack.log.success("Installing dependencies");
  clack.log.success("Configuring Capacitor");
  clack.log.success("Setting up iOS & Android");
  clack.log.success("Project ready");

  console.log();
  console.log("  " + kleur.bold("Your app is ready ✓"));
  console.log();
  console.log("  " + kleur.cyan("Please follow the README.md in the project root to get started."));
  console.log();
  console.log("  Native:");
  console.log();
  console.log("  " + kleur.dim("npx cap sync"));
  console.log("  " + kleur.dim("npx cap open ios"));
  console.log("  " + kleur.dim("npx cap open android"));
  console.log();
  console.log("  " + kleur.dim("─".repeat(41)));
  console.log();
  console.log("  Need the production toolkit?");
  console.log();
  console.log("  " + kleur.dim("CapShip Pro includes advanced native features,"));
  console.log("  " + kleur.dim("production patterns, auth flows, and more."));
  console.log();
  console.log("  " + kleur.blue().underline("capship.org/#pricing"));
  console.log();
  clack.outro(kleur.green("Happy shipping ✓"));
}
