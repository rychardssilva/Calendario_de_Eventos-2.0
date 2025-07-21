  // src/frontend/pages/DashboardUser.jsx
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import Pagination from "../components/Pagination";

  export default function DashboardUser() {
    const [eventos, setEventos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [meusInteresses, setMeusInteresses] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchEventos = async () => {
      try {
        const url = meusInteresses
          ? "http://localhost:3001/api/me/interesses"
          : `http://localhost:3001/api/events?page=${page}&limit=5`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (meusInteresses) {
          setEventos(response.data);
          setTotalPages(1);
        } else {
          setEventos(response.data.events);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        alert("Erro ao buscar eventos.");
      }
    };

    const demonstrarInteresse = async (id) => {
      try {
        await axios.post(
          `http://localhost:3001/api/events/${id}/interesse`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchEventos();
      } catch (error) {
        alert("Erro ao remover interesse.");
      }
    };

    useEffect(() => {
      fetchEventos();
    }, [page, meusInteresses]);

    return (
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Eventos Disponíveis</h1>
          <button
            onClick={() => {
              setMeusInteresses((prev) => !prev);
              setPage(1);
            }}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            {meusInteresses ? "Ver todos" : "Meus interesses"}
          </button>
        </div>

        <div className="grid gap-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{evento.title}</h2>
              <p className="text-sm text-gray-600">
                {evento.date} às {evento.time}
              </p>
              <p>{evento.location}</p>
              <p className="text-sm text-gray-500">
                {evento.interestedCount} pessoas interessadas
              </p>

              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => navigate(`/event/${evento.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  Ver detalhes
                </button>

                {evento.interested ? (
                  <button
                    onClick={() => removerInteresse(evento.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remover interesse
                  </button>
                ) : (
                  <button
                    onClick={() => demonstrarInteresse(evento.id)}
                    className="text-green-600 hover:underline"
                  >
                    Tenho interesse
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!meusInteresses && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    );
  }
