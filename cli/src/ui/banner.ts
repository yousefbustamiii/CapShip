import kleur from "kleur";

const ART = [
  "   ██████╗ █████╗ ██████╗ ███████╗██╗  ██╗██╗██████╗ ",
  "  ██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██║██╔══██╗",
  "  ██║     ███████║██████╔╝███████╗███████║██║██████╔╝ ",
  "  ██║     ██╔══██║██╔═══╝ ╚════██║██╔══██║██║██╔═══╝  ",
  "  ╚██████╗██║  ██║██║     ███████║██║  ██║██║██║      ",
  "   ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ",
].join("\n");

export function printBanner(): void {
  console.log();
  console.log(kleur.bold().blue(ART));
  console.log("  " + kleur.dim("Ship your Capacitor app faster."));
  console.log();
}
