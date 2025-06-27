const { exec } = require('child_process');
const path = require('path');

console.log('Running seed script...');

// Path to the seedUsers.js script
const seedScript = path.join(__dirname, 'seedUsers.js');

// Execute the seed script
const child = exec(`node ${seedScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// Log output in real-time
child.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

child.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});
