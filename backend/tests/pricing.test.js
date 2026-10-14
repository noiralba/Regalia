const assert = require("assert");
const calculatePricing = require("../services/calculatePricing");

// Mocking the database and dependencies for testing - based on the real database
const mockTicketTypesFromDb = [
  { id: "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52", name: "Vuxen", price: 140 },
  { id: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43", name: "Barn", price: 80 },
  { id: "c4e7b219-8a53-46d0-9f12-5b3e7a1c6d84", name: "Pensionär", price: 120 },
];

// Test 1.
const ticketSelection = [
  { ticketTypeId: "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52", quantity: 2 }, // 2 Vuxen tickets
  { ticketTypeId: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43", quantity: 1 }, // 1 Barn ticket
];

const result = calculatePricing(ticketSelection, mockTicketTypesFromDb);
assert.strictEqual(result.total, 360); // 2*140 + 1*80 = 360
assert.strictEqual(result.totalQuantity, 3); // 2 + 1 = 3
console.log("Test 1 passed");
console.log(
  `Total sum: ${result.total} , Total quantity: ${result.totalQuantity}`,
);

// Test 2
assert.throws(() => {
  calculatePricing(
    [{ ticketTypeId: "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52", quantity: -1 }],
    mockTicketTypesFromDb,
  );
}, /Du måste välja minst en biljett av typen/);

console.log("Test 2 passed! Negative quantity correctly throws an error.");
