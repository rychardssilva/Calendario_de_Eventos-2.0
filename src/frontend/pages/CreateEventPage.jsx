// src/frontend/pages/CreateEventPage.jsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateEventPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3001/api/events", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Evento criado com sucesso!");
      navigate("/admin");
    } catch {
      alert("Erro ao criar evento.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Criar Evento</h2>

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
          Criar Evento
        </button>
      </form>
    </div>
  );
}
