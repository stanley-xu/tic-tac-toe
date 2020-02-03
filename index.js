/**
 * Matchmaking server entry file
 */

const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3001

const hash = crypto.createHash('sha256')

let sessions = [{ id: '1234', players: [] }] // for testing

app.get('/', (req, res) => {
  res.json(sessions)
})

app.get('/lobbies', (req, res) => {
  res.json(sessions)
})

// This endpoint is meant for the inviter to hit (to create a lobby)
app.post('/lobbies/', (req, res) => {
  hash.update(new Date().toDateString())
  const gameSession = {
    id: hash.copy().digest('hex'),
    players: []
  }
  sessions.push(gameSession)

  res.json(gameSession)
})

app.delete('/lobbies', (req, res) => {
  sessions = []
  res.json(sessions)
})

app.get('/lobbies/:id', (req, res) => {
  const matchedSessions = sessions.filter(s => s.id === req.params.id)
  if ( matchedSessions.length === 0 )
    throw new Error(`unknown session ${req.params.id}`)
  const session = matchedSessions[0]
  const ready = session.players.length === 2 ? true : false

  res.json({ ready: ready, status: `${ready ? 'Lobby is ready' : 'Lobby pending'}`})
})

// This endpoint is meant for the clients to hit in order to join a lobby
app.post('/lobbies/:id/users/:userid', (req, res) => {
  const matchedSessions = sessions.filter(s => s.id === req.params.id)
  if ( matchedSessions.length === 0 )
    throw new Error(`unknown session ${req.params.id}`)
  const session = matchedSessions[0]
  
  if ( !session.players.includes(req.params.userid) ) {
    if ( session.players.length < 2 ) {
      session.players.push(req.params.userid) 
    } else {
      res.status(500).json({ error: 'Lobby is full'})
    }
  }

  res.json(session)
})

app.listen(port, () => console.log(`Matchmaking server listening at ${port}`))
