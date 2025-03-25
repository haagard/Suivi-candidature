import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [suivis, setSuivis] = useState([]);
  const [entreprise, setEntreprise] = useState('');
  const [poste, setPoste] = useState('');
  const [lienOffre, setLienOffre] = useState('');
  const [dateEnvoi, setDateEnvoi] = useState('');
  const [statut, setStatut] = useState('En attente');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    entreprise: '',
    poste: '',
    lienOffre: '',
    dateEnvoi: '',
    statut: 'En attente'
  });

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const response = await axios.get('/suivis');
      setSuivis(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des candidatures:', err);
    }
  };

  const addSuivi = async () => {
    if (!entreprise.trim() || !poste.trim()) return;
    
    try {
      await axios.post('/suivis', {
        entreprise: entreprise.trim(),
        poste: poste.trim(),
        lienOffre: lienOffre.trim(),
        dateEnvoi,
        statut
      });
      setEntreprise('');
      setPoste('');
      setLienOffre('');
      setDateEnvoi('');
      setStatut('En attente');
      fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la candidature:', err);
    }
  };

  const deleteSuivi = async (id) => {
    try {
      await axios.delete(`/suivis/${id}`);
      fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const updateStatut = async (id, currentStatut) => {
    try {
      await axios.put(`/suivis/${id}`, {
        statut: currentStatut === 'En attente' ? 'Acceptée' : 
               currentStatut === 'Acceptée' ? 'Refusée' : 'En attente'
      });
      fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const startEdit = (suivi) => {
    setEditId(suivi._id);
    setEditData({
      entreprise: suivi.entreprise,
      poste: suivi.poste,
      lienOffre: suivi.lienOffre,
      dateEnvoi: suivi.dateEnvoi,
      statut: suivi.statut
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/suivis/${editId}`, editData);
      setEditId(null);
      fetchSuivis();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
    }
  };

  return (
    <div className="app">
      <h1>Application de suivi de candidature</h1>
      
      <div className="suivi-form">
        <input
          type="text"
          value={entreprise}
          onChange={(e) => setEntreprise(e.target.value)}
          placeholder="Entreprise"
        />
        <input
          type="text"
          value={poste}
          onChange={(e) => setPoste(e.target.value)}
          placeholder="Poste"
        />
        <input
          type="text"
          value={lienOffre}
          onChange={(e) => setLienOffre(e.target.value)}
          placeholder="Lien de l'offre"
        />
        <input
          type="date"
          value={dateEnvoi}
          onChange={(e) => setDateEnvoi(e.target.value)}
          placeholder="Date d'envoi"
        />
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
        >
          <option value="En attente">En attente</option>
          <option value="Acceptée">Acceptée</option>
          <option value="Refusée">Refusée</option>
        </select>
        <button onClick={addSuivi}>Ajouter</button>
      </div>

      <ul className="suivi-list">
        {suivis.map((suivi) => (
          <li key={suivi._id} className={suivi.statut.toLowerCase().replace('é', 'e')}>
            {editId === suivi._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.entreprise}
                  onChange={(e) => setEditData({...editData, entreprise: e.target.value})}
                />
                <input
                  type="text"
                  value={editData.poste}
                  onChange={(e) => setEditData({...editData, poste: e.target.value})}
                />
                <select
                  value={editData.statut}
                  onChange={(e) => setEditData({...editData, statut: e.target.value})}
                >
                  <option value="En attente">En attente</option>
                  <option value="Acceptée">Acceptée</option>
                  <option value="Refusée">Refusée</option>
                </select>
                <button onClick={saveEdit}>Sauvegarder</button>
              </div>
            ) : (
              <>
                <div className="suivi-info">
                  <h3>{suivi.entreprise}</h3>
                  <p>{suivi.poste}</p>
                  <p>Envoyé le: {new Date(suivi.dateEnvoi).toLocaleDateString()}</p>
                  <span className={`statut ${suivi.statut.toLowerCase().replace('é', 'e')}`}>
                    {suivi.statut}
                  </span>
                </div>
                <div className="actions">
                  <button onClick={() => updateStatut(suivi._id, suivi.statut)}>
                    Changer statut
                  </button>
                  <button onClick={() => startEdit(suivi)}>Modifier</button>
                  <button onClick={() => deleteSuivi(suivi._id)}>Supprimer</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;