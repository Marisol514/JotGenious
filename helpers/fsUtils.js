// Import the 'fs' (file system) module
const fs = require('fs');
// Import the 'util' module for promisifying functions
const util = require('util');

// Promisify the 'fs.readFile' function
const readFromFile = util.promisify(fs.readFile);

/**
 * Function to write data to the JSON file given a destination and some content
 * @param {string} destination The file you want to write to.
 * @param {object} content The content you want to write to the file.
 * @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  // Write the content to the specified file
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    // Handle errors if any
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 * Function to read data from a given file, append some content, and write back to the file
 * @param {object} content The content you want to append to the file.
 * @param {string} file The path to the file you want to save to.
 * @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  // Read the file asynchronously
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      // Handle errors if any
      console.error(err);
    } else {
      // Parse the existing data from the file
      const parsedData = JSON.parse(data);
      // Append the new content to the existing data
      parsedData.push(content);
      // Write the updated data back to the file
      writeToFile(file, parsedData);
      // Return the updated data (not really necessary as this is an asynchronous operation)
      return parsedData;
    }
  });
};

// Export the functions to be used in other modules
module.exports = { readFromFile, writeToFile, readAndAppend };
