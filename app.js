const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());           // parse JSON bodies

// mount the authentication routes you created in routes/auth.js
app.use('/auth', require('./routes/auth'));

// health check or whatever
app.get('/', (req,res)=> res.send('API up') );

app.listen(3000, () => console.log('API listening http://localhost:3000'));
