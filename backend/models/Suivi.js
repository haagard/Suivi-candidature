const mongoose = require('mongoose');

const suiviSchema = new mongoose.Schema({
  entreprise: {
    type: String,
    required: [true, "Le nom de l'entreprise est obligatoire"]
  },
  poste: {
    type: String,
    required: [true, "Le poste est obligatoire"]
  },
  lienOffre: String,
  dateEnvoi: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['En attente', 'Acceptée', 'Refusée'],
    default: 'En attente'
  }
});

module.exports = mongoose.model('Suivi', suiviSchema);