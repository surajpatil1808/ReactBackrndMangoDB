const connectToMongo = require('./db');
const express = require('express')
connectToMongo();
const app = express()
const port = 5000

//available routes
// app.get('/', (req, res) => {
//   res.send('Hello suraj')
// })
app.use(express.json())

app.use('/api/auth', require ('./routes/auth'))
app.use('/api/notes', require ('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})