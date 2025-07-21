// src/frontend/pages/EventDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [erro, setErro] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvento(res.data);
      } catch (err) {
        console.error("❌ Erro ao buscar evento:", err.response?.data || err.message);
        setErro("Erro ao carregar evento.");
      }
    };

    fetchEvento();
  }, [id, token]);

  if (erro) return <p className="p-6 text-red-500">{erro}</p>;
  if (!evento) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <img
        src={evento.bannerUrl}
        alt="Banner do evento"
        className="w-full h-60 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold">{evento.title}</h1>
      <p className="text-gray-600">
        {evento.date} às {evento.time} - {evento.location}
      </p>
      <p className="mt-4">{evento.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        {evento.interestedCount} pessoas interessadas
        {evento.interested && " • Você demonstrou interesse"}
      </p>
    </div>
  );
}
