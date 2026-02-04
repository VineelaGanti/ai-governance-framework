import {validateDataIntegrity} from '../lib/mock-factory.ts';

// CASE 1: The AI Hallucination (Physically Impossible)
const hallucinatedData = {
  motorSpeed: 100,         // Full Speed
  powerConsumption: 0,    // Zero Power (Impossible!)
  temperature: 25,
  timestamp: Date.now()
};

console.log("🧪 TESTING CASE 1: AI Hallucination (100% Speed, 0W Power)");
const result1 = validateDataIntegrity(hallucinatedData);

if (result1.valid === false) {
  console.log("✅ SUCCESS: Physics engine caught the hallucination!");
  console.log("❌ ERROR MESSAGE:", result1.error);
} else {
  console.log("🚨 FAILURE: The system allowed physically impossible data.");
}

console.log("\n---");

// CASE 2: The Valid Data (Physically Possible)
const validData = {
  motorSpeed: 50,
  powerConsumption: 288, // Roughly matches your powerFromSpeed(50) logic
  temperature: 30,
  timestamp: Date.now()
};

console.log("🧪 TESTING CASE 2: Valid Architectural Data");
const result2 = validateDataIntegrity(validData);

if (result2.valid === true) {
  console.log("✅ SUCCESS: Valid data passed the integrity check.");
} else {
  console.log("🚨 FAILURE: The system flagged valid data as an error.");
}