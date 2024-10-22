"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token) {
      router.push('/');
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  if (isCheckingAuth){
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!username) {
      setMessage('Por favor, preencha o nome de usuário')
      setIsSubmitting(false)      
      return;
    }
    
    setIsSubmitting(true);
    const userData = { username, password };


    try {
      const response = await axios.post('http://localhost:8000/users/login/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const {access_token, user, id} = response.data;

      if (access_token) {
        // Se o login for bem-sucedido
        setMessage(`Bem vindo, ${user}!`);
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user_name', user);
        localStorage.setItem('id', id);
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } 
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
    <div className="bg-#f5f5f5 flex items-center justify-center h-screen">
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
