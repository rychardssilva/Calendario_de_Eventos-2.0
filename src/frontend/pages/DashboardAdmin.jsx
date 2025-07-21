// src/frontend/pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardAdmin() {
  const [eventos, setEventos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchEventos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/events?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEventos(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert("Erro ao carregar eventos.");
    }
  };

  const excluirEvento = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEventos();
    } catch (error) {
      alert("Erro ao excluir evento.");
    }
  };

  const marcarInteresse = async (id) => {
    try {
      await axios.post(
        `http://localhost:3001/api/events/${id}/interesse`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEventos();
    } catch (error) {
      alert("Erro ao marcar interesse.");
    }
  };

  const removerInteresse = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/events/${id}/interesse`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEventos();
    } catch (error) {
      alert("Erro ao remover interesse.");
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [page]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel do Administrador</h1>
        <button
          onClick={() => navigate("/create-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Criar Evento
        </button>
      </div>

      <div className="grid gap-4">
        {eventos.map((evento) => (
          <div key={evento.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{evento.title}</h2>
            <p className="text-sm text-gray-600">
              {evento.date} às {evento.time}
            </p>
            <p>{evento.location}</p>
            <p className="text-sm text-gray-500">
              {evento.interestedCount} pessoas interessadas
            </p>

            <div className="mt-4 flex gap-3">
              {/* Interesse / Remover Interesse */}
              {evento.interested ? (
                <button
                  onClick={() => removerInteresse(evento.id)}
                  className="text-red-600 hover:underline"
                >
                  Remover Interesse
                </button>
              ) : (
                <button
                  onClick={() => marcarInteresse(evento.id)}
                  className="text-green-600 hover:underline"
                >
                  Tenho Interesse
                </button>
              )}

              {/* Botões Admin */}
              <button
                onClick={() => navigate(`/event/${evento.id}`)}
                className="text-blue-500 hover:underline"
              >
                Ver Detalhes
              </button>
              <button
                onClick={() => navigate(`/edit-event/${evento.id}`)}
                className="text-yellow-500 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => excluirEvento(evento.id)}
                className="text-red-500 hover:underline"
              >
                Excluir
              </button>
              <button
                onClick={() => navigate(`/event/${evento.id}/interessados`)}
                className="text-green-600 hover:underline"
              >
                Ver Interessados
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 py-1">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
