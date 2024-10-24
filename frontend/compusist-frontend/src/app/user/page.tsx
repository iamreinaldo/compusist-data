"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/app/components/withAuth';
import Image from 'next/image';
import logo from "../Logo.png"

const UserPage = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(''); // Estado para mensagens
  const nome_usuario = localStorage.getItem('user_name')
  const router = useRouter();

  useEffect(() => {
    // Carregar o nome de usuário e o userId do localStorage
    const storedName = localStorage.getItem('user_name');
    const storedUserId = localStorage.getItem('id');

    if (storedName) {
      setName(storedName);
    }

    if (storedUserId) {
      // @ts-ignore
      setUserId(storedUserId);
    }
  }, []);

  const apiUrl = userId ? `http://187.103.0.132:43940/users/${userId}` : null;

  const handleEditUsername = async () => {
    if (newUsername && apiUrl) {
      try {
        setMessage(''); // Limpar mensagens anteriores
        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adiciona o token de autenticação
          },
          body: JSON.stringify({ username: newUsername }),
        });

        if (response.ok) {
          setName(newUsername);
          localStorage.setItem('user', newUsername); // Atualiza o username no localStorage
          setMessage('Username alterado com sucesso!'); // Exibe a mensagem de sucesso
        } else {
          const errorData = await response.json();
          setMessage(`Erro ao alterar o username: ${errorData.detail}`); // Exibe a mensagem de erro
        }
      } catch (error) {
        setMessage('Erro ao conectar ao servidor.'); // Exibe a mensagem de erro
      }
    } else {
      setMessage('Por favor, insira um novo username.');
    }
  };

  const handleEditPassword = async () => {
    if (newPassword && apiUrl) {
      try {
        setMessage(''); // Limpar mensagens anteriores
        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adiciona o token de autenticação
          },
          body: JSON.stringify({ password: newPassword }),
        });

        if (response.ok) {
          setMessage('Senha alterada com sucesso!'); // Exibe a mensagem de sucesso
        } else {
          const errorData = await response.json();
          setMessage(`Erro ao alterar a senha: ${errorData.message}`); // Exibe a mensagem de erro
        }
      } catch (error) {
        setMessage('Erro ao conectar ao servidor.'); // Exibe a mensagem de erro
      }
    } else {
      setMessage('Por favor, insira uma nova senha.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('id');
    router.push('/login'); // Redireciona para a página de login
  };

  const handleGoBack = () => {
    router.push('/')
  }

  const handleUserClick = () => {
    router.push('/user');
  };

  const handleLogoClick = () => {
    router.push('/');
  };


  return (
    <div className="bg-#f5f5f5 min-h-screen flex flex-col items-center justify-center">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px' }}>
        <Image src={logo} onClick={handleLogoClick} alt="Logo" className="absolute top-4 left-4 cursor-pointer" />
        <div className='absolute top-4 right-4 flex items-center space-x-2 cursor-pointer' onClick={handleUserClick}>
        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold'>
          {nome_usuario ? nome_usuario.charAt(0).toUpperCase() : ''}
        </div>
        <span onClick={handleUserClick} className="font-medium cursor-pointer hover:underline text-white font-bold">
          {nome_usuario}
        </span>
    </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#ffffff', borderRadius: '8px', width: '300px'}}>
      {/* Campo para editar o nome de usuário */}
      <div style={{ marginBottom: '20px' }}>
        <label>Alterar Username:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Digite o novo username"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <button className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2" onClick={handleEditUsername}>Salvar Username</button>
      </div>

      {/* Campo para editar a senha */}
      <div style={{ marginBottom: '20px'}}>
        <label>Alterar Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Digite a nova senha"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <button className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-2" onClick={handleEditPassword} style={{ marginLeft: '10px', padding: '5px 10px' }}>Salvar Password</button>
      </div>

      {/* Exibição de mensagem */}
      {message && (
        <div style={{ marginTop: '20px', color: message.includes('Erro') ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      {/* Botão de logout */}
      <button className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 m-2" onClick={handleGoBack}>Voltar</button>
      <button className="px-6 py-2 bg-red-400 text-white rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 m-2" onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );
};

export default withAuth(UserPage);

//style={{ marginLeft: '10px', padding: '5px 10px' }}
//style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'gray', color: 'white' }}
// style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white' }}