#!/usr/bin/env node

const VERSION = "0.0.0";
const command = process.argv[2];

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
}

if (command === "--version" || command === "-v") {
  console.log(VERSION);
  process.exit(0);
}

const handlers = {
  build: "viact build is scaffolded. The next step is wiring the Vite plugin into a real production build.",
  dev: "viact dev is scaffolded. The next step is starting a Vite dev server and generating the virtual modules.",
  preview: "viact preview is scaffolded. The next step is serving the built client output through the Node adapter.",
};

if (!(command in handlers)) {
  console.error(`Unknown viact command: ${command}`);
  printHelp();
  process.exit(1);
}

console.log(handlers[command]);

function printHelp() {
  console.log(`viact ${VERSION}

Usage:
  viact dev
  viact build
  viact preview
`);
}
