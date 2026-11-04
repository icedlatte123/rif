import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const services = [
  { name: "backend", args: ["--prefix", "backend", "run", "dev"] },
  { name: "frontend", args: ["--prefix", "frontend", "run", "dev"] }
];

const children = services.map(({ name, args }) => {
  const child = spawn(npm, args, { stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (code && !signal) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });
  return child;
});

let stopping = false;
function shutdown(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  process.exitCode = exitCode;
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
