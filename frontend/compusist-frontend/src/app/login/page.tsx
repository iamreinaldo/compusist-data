"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userData = { username, password };

    try {
      const response = await axios.post('http://localhost:8000/users/login/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Se o login for bem-sucedido
      setMessage('Login bem-sucedido!');
      // Redireciona para a página principal após login
      setTimeout(() => {
        router.push('/'); // ou a rota que você desejar
      }, 2000);
    } catch (error) {
      // Se o usuário não for encontrado, redireciona para a página de cadastro
      if (error.response && error.response.status === 404) {
        setMessage('Usuário não encontrado, redirecionando para o cadastro...');
        setTimeout(() => {
          router.push(`/register?username=${username}`); // Redireciona para o cadastro com o username preenchido
        }, 2000);
      } else {
        setMessage('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Login</h1>
        </div>
        {message && (
          <div className="text-center text-white mb-4">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nome de Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar / Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
