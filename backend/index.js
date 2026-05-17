const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage with 10 default dramas
let dramas = [
  { id: 1, nombre: "Lovely Runner", genero: "Romance", calificacion: 4, reseña: "Un viaje en el tiempo inolvidable y muy emotivo.", imagen: "https://imgs.search.brave.com/PYT6gk4ki6B8ntR_toe6WbWYfR_JQ0L04pzwznDFHK0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/cHYtdGFyZ2V0LWlt/YWdlcy8zMjAxMjNl/NjAxNjMyZjgzYTE0/NzI2ZWY0MjBmZGE5/Y2Q2NzU5M2I5ZWM0/MTk0M2Q3ZWQzNDE3/YmMyNzgyNmFkLmpw/Zw" },
  { id: 2, nombre: "First Frost", genero: "Romance", calificacion: 5, reseña: "Muy bueno", imagen: "https://imgs.search.brave.com/6FVX7ZHJ2H3LEWYlDA_vR50SRoYGns0ml4yLR-DcXs0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zbS5t/YXNoYWJsZS5jb20v/dC9tYXNoYWJsZV9t/ZS9waG90by9kZWZh/dWx0L3VudGl0bGVk/LTIwMjUtMDItMjB0/MTQ0NTE3MTA0XzQz/dXEuMTI0OC5qcGc" },
  { id: 3, nombre: "Hidden Love", genero: "Escolar", calificacion: 4, reseña: "Divertida", imagen: "https://imgs.search.brave.com/irskFrYfiRSzeMOme0DmlmRe-sH9D8naIO-bfUUwe3c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yYWRp/aS5jby93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNS8wMy9yYWRp/aS10aGUtZmlyc3Qt/ZnJvc3Qtc3VjY2Vz/cy1iYWNrbGFzaC0w/Mi5wbmc" },
  { id: 4, nombre: "Good Boy", genero: "Mixto", calificacion: 5, reseña: "Me encanto tiene de todo es estresante y muy chistosa", imagen: "https://imgs.search.brave.com/XlJOgcsVhhqfuOmwmPSc8-iZzLxqontd505ZEi3AUOQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vdGhlZmFu/Z2lybHZlcmRpY3Qu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI1LzA3L0dvb2Qt/Qm95LTAwNS5qcGc_/cmVzaXplPTc2NCw1/MDkmc3NsPTE" },
  { id: 5, nombre: "My idol", genero: "Mixto", calificacion: 4, reseña: "Mafia, comedia y justicia en un solo drama.", imagen: "https://imgs.search.brave.com/GbFP2XyQdJJdOHjir6lq0EzimBN5jlYNnqt0VUsFEtI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLnNyY2RuLmNv/bS93b3JkcHJlc3Mv/d3AtY29udGVudC91/cGxvYWRzLzIwMjYv/MDEvaWRvbC1pLW5l/dGZsaXgtay1kcmFt/YS5qcGc_cT00OSZm/aXQ9Y3JvcCZ3PTgy/NSZkcHI9Mg" },
  { id: 6, nombre: "The Heirs", genero: "Mixto", calificacion: 5, reseña: "Un clasico muy buena", imagen: "https://imgs.search.brave.com/OwYjcnhbdJxlmBxJJyoW--Wi_lllDcIEZ9o5m5Eq9T8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc2lh/bndpa2kuY29tL2lt/YWdlcy80LzQ4L1Ro/ZV9IZWlyc18tX0tv/cmVhbl9EcmFtYS1w/MS5qcGc" },
  { id: 7, nombre: "Business Proposal", genero: "Mixto", calificacion: 5, reseña: "Chistosa y buena producción", imagen: "https://imgs.search.brave.com/Vr3bdJ4Sd3zMR1RIRHmuZUze3qsFILU6d8sRpiZg2Hs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmRlbGl2ZXJlZC5j/by5rci93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNS8xMC9idXNp/bmVzcy1wcm9wb3Nh/bC1rZHJhbWEtcHJv/ZmlsZS1kZWxpdmVy/ZWQta29yZWEuanBn" },
  { id: 8, nombre: "Strong Woman Do Bong Soon", genero: "Comedia", calificacion: 5, reseña: "Una protagonista fuerte y una pareja adorable.", imagen: "https://imgs.search.brave.com/zAPgMqNQdj40EQi-8g8BpdUl2tgUoGL2-Th2dHVIr9s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3RlbGxhcnNpc3Rl/cnMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE3LzA4L3N0/cm9uZy13b21hbi1k/by1ib25nLXNvb24t/MDMuanBn" },
  { id: 9, nombre: "No Tail to Tell", genero: "Fantasía", calificacion: 3, reseña: "Si un 3 el final lo daña todo esa protagonista no aprendió su lección", imagen: "https://imgs.search.brave.com/37EDdH0egRLc28-aDxj26Jgi2-feUNHGgJDPX-_h4GM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuanVzdHdhdGNo/LmNvbS9iYWNrZHJv/cC8zNDE1NTI5Mzkv/czY0MC9uby10YWls/LXRvLXRlbGwuanBn" },
  { id: 10, nombre: "Boyfriend on Demand", genero: "Mixto", calificacion: 2, reseña: "Buena producción pero no me gusto la historia y el protagonista parecia 2nd lead", imagen: "https://imgs.search.brave.com/75EvfjQg1SoLnePSEd8FI6IwDARJ9a_5TpTbnTG7ZGY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmlsbGJvYXJkLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Ni8wMy9qaXNvby1i/b3lmcmllbmQtb24t/ZGVtYW5kLTMtbmV0/ZmxpeC1iaWxsYm9h/cmQtMTgwMC5qcGc_/dz04NzUmaD01ODMm/Y3JvcD0x" }
];

// GET: Obtener todas las reseñas
app.get('/api/dramas', (req, res) => {
  res.json(dramas);
});

// GET por ID: Consultar una reseña específica
app.get('/api/dramas/:id', (req, res) => {
  const drama = dramas.find(d => d.id === parseInt(req.params.id));
  if (!drama) return res.status(404).send('Drama no encontrado');
  res.json(drama);
});

// POST: Crear una nueva reseña
app.post('/api/dramas', (req, res) => {
  const newDrama = {
    id: dramas.length > 0 ? Math.max(...dramas.map(d => d.id)) + 1 : 1,
    nombre: req.body.nombre,
    genero: req.body.genero,
    calificacion: parseInt(req.body.calificacion),
    reseña: req.body.reseña,
    imagen: req.body.imagen || "https://via.placeholder.com/300x400?text=No+Image"
  };
  dramas.push(newDrama);
  res.status(201).json(newDrama);
});

// PUT: Actualizar una reseña existente
app.put('/api/dramas/:id', (req, res) => {
  const dramaIndex = dramas.findIndex(d => d.id === parseInt(req.params.id));
  if (dramaIndex === -1) return res.status(404).send('Drama no encontrado');

  dramas[dramaIndex] = {
    ...dramas[dramaIndex],
    nombre: req.body.nombre,
    genero: req.body.genero,
    calificacion: parseInt(req.body.calificacion),
    reseña: req.body.reseña,
    imagen: req.body.imagen
  };

  res.json(dramas[dramaIndex]);
});

// DELETE: Eliminar una reseña
app.delete('/api/dramas/:id', (req, res) => {
  const dramaIndex = dramas.findIndex(d => d.id === parseInt(req.params.id));
  if (dramaIndex === -1) return res.status(404).send('Drama no encontrado');

  const deletedDrama = dramas.splice(dramaIndex, 1);
  res.json(deletedDrama);
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
