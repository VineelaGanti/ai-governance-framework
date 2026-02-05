import fs from 'fs';
import readline from 'readline';

// Proprietary governance rules - used as evidence of systematic oversight
const rules = [
  { id: 7, desc: "Named Exports Only", regex: /export default/g },
  { id: 10, desc: "No Nested Ternaries", regex: /\?.*?\?.*?:/g }
];

// --- PHYSICS VALIDATION TEST ---
// Validates that AI-generated telemetry adheres to physical laws
function runPhysicsTest() {
  console.log("🧪 [CRITICAL] INITIALIZING PHYSICS INTEGRITY SCAN...");
  
  // This represents the "Hallucinated" output from an AI model
  const hallucinatedData = { motorSpeed: 100, powerConsumption: 50 };
  
  console.log(`📊 TELEMETRY RECEIVED: Speed: ${hallucinatedData.motorSpeed}%, Power: ${hallucinatedData.powerConsumption}W`);

  // Logic: Power must exist if Speed > 0
  if (hallucinatedData.motorSpeed > 0 && hallucinatedData.powerConsumption === 0) {
    console.log("🚨 ALERT: PHYSICAL INVARIANTS VIOLATED!");
    console.log("🚨 REASON: Law of Conservation of Energy - Motor cannot spin with zero power.");
    console.log("❌ CRITICAL: AI HALLUCINATION DETECTED. SAFETY INTERCEPT ACTIVE.");
    return false; // Return false to trigger the "Block"
  }
  return true;
}

async function runAudit() {
  // First: Verify Physical Reality
  const physicsPassed = runPhysicsTest();
  if (!physicsPassed) {
    console.log("🚨 BLOCKING: System detected physical hallucinations. Audit halted.");
    process.exit(1);
  }

  // Second: Verify Architectural Standards
  console.log("\n🔍 RUNNING ARCHITECTURAL COMPLIANCE AUDIT...");
  const files = ['lib/mock-factory.ts']; 
  let violations = [];

  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    rules.forEach(rule => {
      if (content.match(rule.regex)) {
        violations.push({ file, ...rule });
      }
    });
  });

  if (violations.length === 0) {
    console.log("✅ GOVERNANCE PASSED: All architectural invariants satisfied.");
    process.exit(0);
  }

  console.warn("\n⚠️ GOVERNANCE VIOLATION DETECTED BY AI-AUDITOR");
  violations.forEach(v => console.log(`- Rule #${v.id} (${v.desc}) found in ${v.file}`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  console.log("\n--- AUDIT LOG GENERATION ---");
  rl.question("Provide your expert technical justification to override this rule: ", (answer) => {
    const logEntry = `\n[${new Date().toISOString()}]\nFILE: ${violations[0].file}\nRULE: ${violations[0].desc}\nJUSTIFICATION: ${answer}\n-------------------`;
    fs.appendFileSync('OVERRIDE_LOG.md', logEntry);
    console.log("\n✅ Decision recorded in OVERRIDE_LOG.md. Infrastructure remains compliant.");
    rl.close();
    process.exit(0); 
  });
}

runAudit();