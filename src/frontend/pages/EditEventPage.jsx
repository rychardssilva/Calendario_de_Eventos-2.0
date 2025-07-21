// src/frontend/pages/EditEventPage.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditEventPage() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        reset(res.data);
      } catch (error) {
        alert("Erro ao carregar evento ou você não tem permissão.");
        navigate("/admin");
      }
    };
    fetchEvent();
  }, [id, reset, navigate, token]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3001/api/events/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Evento atualizado com sucesso!");
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao atualizar evento.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Editar Evento</h2>

        <input
          {...register("title")}
          placeholder="Título"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("description")}
          placeholder="Descrição"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("location")}
          placeholder="Local"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("date")}
          type="date"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("time")}
          type="time"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("category")}
          placeholder="Categoria"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("bannerUrl")}
          placeholder="URL do Banner"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
