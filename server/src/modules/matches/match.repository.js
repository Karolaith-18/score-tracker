import { Match } from './match.model.js'

export const matchRepository = {
  findAll: () =>
    Match.find().sort({ createdAt: -1 }).lean(),

  findById: (id) =>
    Match.findById(id).lean(),

  create: (data) =>
    Match.create(data),

  update: (id, data) =>
    Match.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(),

  delete: (id) =>
    Match.findByIdAndDelete(id).lean(),
}