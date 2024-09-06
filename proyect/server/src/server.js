// src/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({msg : 'backend'});
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}/api/data`);
});
