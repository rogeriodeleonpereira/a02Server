const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, 'db.json');

/**
 * Loads items from the database.
 * 
 * @returns {Array} An array of items loaded from the database. Returns an empty array if no items are found.
 */
function loadItems() {
  if (fs.existsSync(dbFilePath)) {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    const db = JSON.parse(data);
    return db.items;
  }
  return [];
}

/**
 * Saves items to the database.
 * 
 * @param {Array} items - The array of items to be saved to the database.
 */
function saveItems(items) {
  const db = { items };
  const jsonData = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbFilePath, jsonData, 'utf8');
}

/**
 * Generates a unique ID for an item.
 * 
 * Combines the current timestamp with a random string to ensure uniqueness.
 * 
 * @returns {string} A unique ID string.
 */
function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

module.exports = { loadItems, saveItems, generateUniqueId };
