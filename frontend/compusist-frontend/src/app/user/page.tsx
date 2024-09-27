"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/app/components/withAuth';

const UserPage = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(''); // Estado para mensagens
  const router = useRouter();

  useEffect(() => {
    // Carregar o nome de usuário e o userId do localStorage
    const storedName = localStorage.getItem('user_name');
    const storedUserId = localStorage.getItem('id');

    if (storedName) {
      setName(storedName);
    }

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const apiUrl = userId ? `http://localhost:8000/users/${userId}` : null;

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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{name}</h1>

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
        <button onClick={handleEditUsername} style={{ marginLeft: '10px', padding: '5px 10px' }}>Salvar Username</button>
      </div>

      {/* Campo para editar a senha */}
      <div style={{ marginBottom: '20px' }}>
        <label>Alterar Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Digite a nova senha"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <button onClick={handleEditPassword} style={{ marginLeft: '10px', padding: '5px 10px' }}>Salvar Password</button>
      </div>

      {/* Exibição de mensagem */}
      {message && (
        <div style={{ marginTop: '20px', color: message.includes('Erro') ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      {/* Botão de logout */}
      <button onClick={handleGoBack} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'gray', color: 'white' }}>Voltar</button>
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>Logout</button>
    </div>
  );
};

export default withAuth(UserPage);
