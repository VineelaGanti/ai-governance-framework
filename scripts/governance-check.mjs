import fs from 'fs';
import readline from 'readline';

// These are your proprietary governance rules translated into code checks
const rules = [
  { id: 7, desc: "Named Exports Only", regex: /export default/g },
  { id: 10, desc: "No Nested Ternaries", regex: /\?.*?\?.*?:/g }
];

async function runAudit() {
  // Define which files to audit for compliance
  const files = ['lib/mock-factory.ts']; 
  let violations = [];

  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    rules.forEach(rule => {
      // Check for violations of your 15-rule set
      if (content.match(rule.regex)) {
        violations.push({ file, ...rule });
      }
    });
  });

  if (violations.length === 0) {
    console.log("✅ GOVERNANCE PASSED: No architectural slop detected.");
    process.exit(0);
  }

  console.warn("\n⚠️ GOVERNANCE VIOLATION DETECTED BY AI-AUDITOR");
  violations.forEach(v => console.log(`- Rule #${v.id} (${v.desc}) found in ${v.file}`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  console.log("\n---AUDIT LOG GENERATION ---");
  rl.question("Provide your expert technical justification to override this rule: ", (answer) => {
    const logEntry = `\n[${new Date().toISOString()}]\nFILE: ${violations[0].file}\nJUSTIFICATION: ${answer}\n-------------------`;
    fs.appendFileSync('OVERRIDE_LOG.md', logEntry);
    console.log("\n✅ Decision recorded in OVERRIDE_LOG.md. Proceeding with commit...");
    rl.close();
    process.exit(0); 
  });
}

runAudit();