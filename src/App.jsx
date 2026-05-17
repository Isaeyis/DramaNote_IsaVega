import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const API_URL = '/api/dramas';

function App() {
  const [dramas, setDramas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    genero: '',
    calificacion: 5,
    reseña: '',
    imagen: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDramas();
  }, []);

  const fetchDramas = async () => {
    try {
      const response = await axios.get(API_URL);
      setDramas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dramas:', error);
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en el puerto 5000.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ nombre: '', genero: '', calificacion: 5, reseña: '', imagen: '' });
      setEditingId(null);
      setShowModal(false);
      fetchDramas();
    } catch (error) {
      console.error('Error saving drama:', error);
    }
  };

  const handleEdit = (drama) => {
    setFormData(drama);
    setEditingId(drama.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de que quieres eliminar esta reseña?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDramas();
      } catch (error) {
        console.error('Error deleting drama:', error);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} star-rating`}></i>
      );
    }
    return stars;
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg mb-4">
        <div className="container">
          <span className="navbar-brand">
            <i className="bi bi-journal-heart me-2"></i>
            DramaNote
          </span>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingId(null);
              setFormData({ nombre: '', genero: '', calificacion: 5, reseña: '', imagen: '' });
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Nueva Reseña
          </button>
        </div>
      </nav>

      <div className="container">
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {dramas.length === 0 && !error && (
          <div className="text-center py-5">
            <h3 className="text-muted">No hay reseñas todavía. ¡Agrega la primera!</h3>
          </div>
        )}

        <div className="row g-4">
          {dramas.map((drama) => (
            <div key={drama.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <img 
                  src={drama.imagen || 'https://via.placeholder.com/300x400?text=Drama+Cover'} 
                  className="card-img-top" 
                  alt={drama.nombre} 
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{drama.nombre}</h5>
                    <span className="badge bg-light text-dark border">{drama.genero}</span>
                  </div>
                  <div className="mb-2">
                    {renderStars(drama.calificacion)}
                  </div>
                  <p className="card-text flex-grow-1 text-muted">
                    {drama.reseña}
                  </p>
                  <div className="mt-3 d-flex gap-2">
                    <button 
                      className="btn btn-outline-secondary btn-sm flex-grow-1"
                      onClick={() => handleEdit(drama)}
                    >
                      <i className="bi bi-pencil me-1"></i> Editar
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm flex-grow-1"
                      onClick={() => handleDelete(drama.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? 'Editar Reseña' : 'Nueva Reseña de Drama'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Drama</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Género</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="genero" 
                      value={formData.genero} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Calificación (1-5)</label>
                    <select 
                      className="form-select" 
                      name="calificacion" 
                      value={formData.calificacion} 
                      onChange={handleInputChange}
                    >
                      <option value="1">1 Estrella</option>
                      <option value="2">2 Estrellas</option>
                      <option value="3">3 Estrellas</option>
                      <option value="4">4 Estrellas</option>
                      <option value="5">5 Estrellas</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL de la Imagen (Portada)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="imagen" 
                      value={formData.imagen} 
                      onChange={handleInputChange} 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tu Reseña</label>
                    <textarea 
                      className="form-control" 
                      name="reseña" 
                      rows="3" 
                      value={formData.reseña} 
                      onChange={handleInputChange} 
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Guardar Cambios' : 'Agregar Drama'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
