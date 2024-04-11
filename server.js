const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const port = process.env.PORT || 4042;

// Import functions from the simulated database module
const { loadItems, saveItems, generateUniqueId } = require('./middleware/db'); 

// Load initial items from the database
let items = loadItems();

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());

// Middleware to allow requests from any source
// (in a real world scenario we should specify the valid sources )
// app.use(cors({
//    origin: 'http://example.com' // Replace with your desired origin
// }));
app.use(cors());

/**
 * Route to serve the main API documentation page from the root URL.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

/**
 * Route to serve the API documentation page.
 */
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/api.html'));
});

/**
 * GET endpoint to retrieve all items.
 */
app.get('/api/items', (req, res) => {
  res.status(200).json(items);
});

/**
 * GET endpoint to retrieve a single item by its unique ID.
 * @param {string} id - The unique ID of the item to retrieve.
 */
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).send('Item not found.');
  }
  res.status(200).json(item);
});

/**
 * POST endpoint to create a new item.
 * @param {Object} req.body - The content of the item to create.
 */
app.post('/api/items', (req, res) => {
  const newItem = { id: generateUniqueId(), ...req.body };
  items.push(newItem);
  saveItems(items); // Persist the updated items array to the database
  res.status(201).json(newItem);
});

/**
 * PUT endpoint to update an item fully by its ID.
 * @param {string} id - The unique ID of the item to update.
 * @param {Object} req.body - The new content of the item.
 */
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send('Item not found.');
  }
  const updatedItem = { id, ...req.body };
  items[itemIndex] = updatedItem;
  saveItems(items); // Persist the updated items array to the database
  res.status(200).json(updatedItem);
});

/**
 * PATCH endpoint to update parts of an item by its ID.
 * @param {string} id - The unique ID of the item to partially update.
 */
app.patch('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).send('Item not found.');
  }
  Object.entries(req.body).forEach(([key, value]) => {
    item[key] = value;
  });
  saveItems(items); // Persist the updated items array to the database
  res.status(200).json(item);
});

/**
 * DELETE endpoint to remove an item by its ID.
 * @param {string} id - The unique ID of the item to delete.
 */
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send('Item not found.');
  }
  items = items.filter(item => item.id !== id);
  saveItems(items); // Persist the updated items array to the database
  res.status(200).send('Item deleted successfully'); 
});

/**
 * POST endpoint to reset the fake DB to the initial state
 */
app.post('/api/reset', async (req, res) => {
  const dbPath = path.join(__dirname, 'middleware', 'db.json');
  const defaultDbPath = path.join(__dirname, 'middleware', 'default_db.json');

  try {
    await fs.copyFile(defaultDbPath, dbPath);
    items = loadItems();
    res.status(200).send('Database has been reset to default.');
  } catch (err) {
    console.error("Failed to reset database:", err);
    res.status(500).send('Failed to reset the database.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening to port ${port}: http://localhost:${port}`)
});
