
const refillScreenings = require("./scripts/add-screenings.js");

const INTERVAL_MS = 10 * 60 * 1000;
let running = false;

async function tick() {
  if (running) return;

  running = true;

  try {
    const added = await refillScreenings();

    if (added > 0) {
      console.log(`Lade till ${added} visningar`);
    }
  } catch (err) {
    console.error("Påfyllning misslyckades:", err);
  } finally {
    running = false;
  }
}

function startScheduler() {
  tick();
  setInterval(tick, INTERVAL_MS);
}

module.exports = { startScheduler };
