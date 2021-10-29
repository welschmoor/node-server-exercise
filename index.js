// fullstackopen, exercises 3.1-3.6 completed
const { response } = require("express")
const express = require("express")
const app = express()
const morgan = require("morgan")

const uniqid = require("uniqid")

const requestLogger = (request, response, next) => {
  console.log("1 Method:", request.method)
  console.log("2 Path:  ", request.path)
  console.log("3 Body:  ", request.body)
  console.log("---")
  next()
}

app.use(express.json())
app.use(requestLogger)
// exercise 3.8
morgan.token("type", function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :type"))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/", (req, res) => {
  res.send("<h1>Sup!</h1>")
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

// :ID
app.get("/api/persons/:id", (req, res) => {
  const reqId = +req.params.id
  const contact = persons.find((each) => each.id === reqId)

  if (!contact) {
    res.status(404).end()
    return
  }
  res.json(contact)
})

// DELETE
app.delete("/api/persons/:id", (req, res) => {
  const reqId = +req.params.id
  persons = persons.filter((e) => e.id !== reqId)

  response.status(204).end()
})

// POST NEW
app.post("/api/persons", (req, res) => {
  const body = req.body // <add app.use(express.json()) on top else won't work

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name missing!",
    })
  }

  // handling duplicate names (I believe I don't need isDuplicate and can just do the logic inside if...):
  let isDuplicate = false
  persons.forEach((e) => {
    if (e.name.trim().toLowerCase() === body.name.trim().toLowerCase()) {
      isDuplicate = true
    }
  })
  if (isDuplicate) {
    return res.status(400).json({
      error: "Name already exists!",
    })
  }

  const maxId = persons.length > 0 ? Math.max(...persons.map((e) => e.id)) : 0
  const newPerson = {
    id: maxId + 1,
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.get("/info", (req, res) => {
  const timeAndDate = new Date()
  res.send(`
        <p>Phonebooks has info for 4 people</p>
        ${timeAndDate}
    `)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
