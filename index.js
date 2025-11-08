const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Car rental server is running')
})

app.listen(port, () => {
  console.log(`Car rental server listening on port : ${port}`)
})
