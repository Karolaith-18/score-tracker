import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true, maxlength: 30 },
  color: { type: String, default: '#3b7fff' },
}, { _id: false })

const setResultSchema = new mongoose.Schema({
  set:    { type: Number, required: true },
  scoreA: { type: Number, required: true },
  scoreB: { type: Number, required: true },
  winner: { type: String, enum: ['A', 'B'], required: true },
}, { _id: false })

const matchSchema = new mongoose.Schema({
  teamA:      { type: teamSchema, required: true },
  teamB:      { type: teamSchema, required: true },
  maxSets:    { type: Number, enum: [3, 5], default: 5 },
  serving:    { type: String, enum: ['A', 'B'], default: 'A' },
  status:     { type: String, enum: ['playing', 'set_over', 'match_over'], default: 'playing' },
  winner:     { type: String, enum: ['A', 'B', null], default: null },
  currentSet: { type: Number, default: 1 },
  scoreA:     { type: Number, default: 0 },
  scoreB:     { type: Number, default: 0 },
  setsA:      { type: Number, default: 0 },
  setsB:      { type: Number, default: 0 },
  setHistory: { type: [setResultSchema], default: [] },
  startedAt:  { type: Date, default: Date.now },
  finishedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

export const Match = mongoose.model('Match', matchSchema)