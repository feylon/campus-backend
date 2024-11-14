import fs from "fs"
// Function to read and display logs from app.log
const readLogs = () => {
  fs.readFile('app.log', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the log file:', err);
      return;
    }

    // Print the contents of the log file
    console.log('Contents of app.log:\n');
    console.log(data);
  });
};

// Call the function to read logs
readLogs();
