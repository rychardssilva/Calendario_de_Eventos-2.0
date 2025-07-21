// src/frontend/pages/RegisterPage.jsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("📤 Enviando dados para registro:", data);

      const response = await axios.post("http://localhost:3001/api/register", data);
      console.log("✅ Resposta do servidor:", response.data);

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      console.error("📥 Detalhes do erro:", error.response?.data || error.message);
      alert(`Erro ao registrar: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

        <input
          type="text"
          {...register("name")}
          placeholder="Nome Completo"
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          {...register("email")}
          placeholder="E-mail"
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          {...register("password")}
          placeholder="Senha"
          className="w-full p-2 border rounded"
        />

        <select
          {...register("role")}
          className="w-full p-2 border rounded"
          defaultValue="PARTICIPANTE"
        >
          <option value="ADMIN">Administrador</option>
          <option value="PARTICIPANTE">Participante</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Cadastrar
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Faça login
          </a>
        </p>
      </form>
    </div>
  );
}
