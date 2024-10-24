"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import logo from "../../Logo.png"
import withAuth from '@/app/components/withAuth';

const ClientePage = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atributos, setAtributos] = useState(false); // Inicializando como array vazio
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagem de erro
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para o modo de edição
  const router = useRouter();
  const token = localStorage.getItem('access_token');
  const nome_usuario = localStorage.getItem('user_name');
  const user_id = localStorage.getItem('id');
  const [formData, setFormData] = useState({
    network_customer: false,
    network: '',
    server_customer: false,
    server_addr: '',
    server_pass: '',
    mgmt_pass: '',
    ip_list: '',
    clock_customer: false,
    clock_addr: '',
    clock_system_pass: '',
    tech_team: false,
  });

  const params = useParams(); 
  const clienteId = params?.clientesId;

  useEffect(() => {
    if (clienteId) {
      const fetchCliente = async () => {
        try {
          const responseCliente = await axios.get(`http://187.103.0.132:43940/customers/${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
          });
          setCliente(responseCliente.data);
          
          // Buscar os atributos do cliente
          const responseAtributos = await axios.get(`http://187.103.0.132:43940/customers/attributes/${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
          });
          if (responseAtributos.status === 200) {
            setAtributos(responseAtributos.data); // Atributos encontrados

          } else {
            setAtributos([]); // Nenhum atributo encontrado
            setErrorMessage('Nenhum atributo cadastrado.');
          }

          setLoading(false);
        } catch (error) {
          setErrorMessage(error.response?.data?.detail || 'Erro desconhecido');
          setLoading(false);
        }
      };

      fetchCliente();
    } else {
      setErrorMessage("ID do cliente não encontrado.");
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if(cliente) {
      document.title = `Compusist - ${cliente.name}`
    }
  }, [cliente])

  const handleAddInfoClick = () => {
    setShowForm(true);
  };

  // const handleCancel = () => {
  //   setShowForm(false); // Fecha o formulário
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '')
    );

  
    try {
      if (isEditing) {
        const response = await fetch(`http://187.103.0.132:43940/customers/attributes/${clienteId}`, {
          method: 'PATCH',
          headers:{
            'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({ 
          ...sanitizedFormData,
          customer_id: Number(clienteId), // Inclua o customer_id e outros campos necessários
          user_id: Number(user_id),
        }),
        });
        
        // Verifique se a requisição foi bem-sucedida antes de recarregar
        if (response.status === 200 || response.status === 204) {
          window.location.reload(); // Recarregar a página após sucesso
        }
      } else {
        const response = await fetch('http://187.103.0.132:43940/customers/attributes', {
          method: 'POST',
          headers:{
            'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            ...sanitizedFormData,
            customer_id: Number(clienteId),
            user_id: Number(user_id), // Ajuste conforme necessário
          }),
        });
        
        // Verifique se a requisição foi bem-sucedida antes de recarregar
        if (response.status === 200 || response.status === 201) {
          window.location.reload(); // Recarregar a página após sucesso
        }
      }
    } catch (error) {
      console.error('Erro ao enviar atributos:', error.response || error);
    }
  };
  

  const handleEditInfoClick = () => {
    setFormData({
      network_customer: atributos.network_customer,
      network: atributos.network,
      server_customer: atributos.server_customer,
      server_addr: atributos.server_addr,
      server_pass: atributos.server_pass,
      mgmt_pass: atributos.mgmt_pass,
      ip_list: atributos.ip_list,
      clock_customer: atributos.clock_customer,
      clock_addr: atributos.clock_addr,
      clock_system_pass: atributos.clock_system_pass,
      tech_team: atributos.tech_team,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Tem certeza que deseja deletar as informações do cliente?");
    
    if (confirmed) {
      try {
        const response = await axios.delete(`http://187.103.0.132:43940/customers/attributes/${clienteId}`);
        
        if (response.status === 200 || response.status === 204) {
          window.location.reload(); // Recarrega a página após a exclusão bem-sucedida
        }
      } catch (error) {
        console.error('Erro ao deletar atributos:', error);
      }
    }
  };

  const handleUserClick = () => {
    router.push('/user');
  };

  const handleLogoClick = () => {
    router.push('/');
  };
  

  if (loading) {
    
    return( 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
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
      <div>Carregando...</div>
      </div>
      )
  }

  if (!cliente) {
    return(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
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
        <div>Cliente não encontrado</div>
      </div>
      )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
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
    <div className='text-gray-700' style={{ width: '300px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
      <h1><strong>{cliente.name}</strong></h1>
      <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
      <p><strong>Contato:</strong> {cliente.contact}</p>
      <p><strong>Endereço:</strong> {cliente.address}</p>
    </div>

      {/* Exibir mensagem de erro caso haja */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Se o cliente tiver atributos, exibi-los */}
      {atributos ? (
        <div style={{ width: '300px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', margin: '2px' }}>
        <div>
          <br />
          <h2 className='text-gray-700'><strong>Informações do Cliente</strong></h2>
          <br/>
          <ul className='text-gray-700'>
            {/* Exibir os atributos corretamente */}
            <li><strong>É cliente de redes?:</strong> {atributos.network_customer ? 'Sim' : 'Não'}</li>
            <li><strong>Configuração de rede:</strong> {atributos.network}</li>
            <li><strong>Possui servidor?:</strong> {atributos.server_customer ? 'Sim' : 'Não'}</li>
            <li><strong>Endereço do servidor:</strong> {atributos.server_addr}</li>
            <li><strong>Senha do servidor:</strong> {atributos.server_pass}</li>
            <li><strong>Senha de gerência:</strong> {atributos.mgmt_pass}</li>
            <li><strong>Lista de IPs:</strong> {atributos.ip_list}</li>
            <li><strong>É cliente de relógio?:</strong> {atributos.clock_customer ? 'Sim' : 'Não'}</li>
            <li><strong>Endereço do relógio:</strong> {atributos.clock_addr}</li>
            <li><strong>Senha do sistema do relógio:</strong> {atributos.clock_system_pass}</li>
            <li><strong>Tem equipe técnica?:</strong> {atributos.tech_team ? 'Sim' : 'Não'}</li>
          </ul>
          <br />
          <div className="flex justify-between space-x-1">
          <button
                  type="button"
                  onClick={handleEditInfoClick}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Editar informações
          </button>
          <button
                  type="submit"
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Deletar informações
          </button>
            </div>
        </div>
        </div>
      ) : (
        // Caso não tenha atributos, exibir o botão para adicionar
        <button onClick={handleAddInfoClick}
        className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
>
          Adicionar informações
        </button>
      )}

      {showForm && (
        <div style={{ width: '300px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', margin:'3px' }}>
        <form className='text-gray-700' onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <label>
            É um cliente de redes? (Network Customer):
            <input
              type="checkbox"
              name="network_customer"
              checked={formData.network_customer}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Configuração de rede (Network):
            <input
              type="text"
              name="network"
              value={formData.network}
              onChange={handleInputChange}
              style={{ color: 'black' }} // Texto digitado será preto
            />
          </label>
          <br />
          <label>
            Possui um servidor?:
            <input
              type="checkbox"
              name="server_customer"
              checked={formData.server_customer}
              onChange={handleInputChange}
              />
          <br />
          </label>
          <label>
            Endereço do server (Server Address):
            <input
              type="text"
              name="server_addr"
              value={formData.server_addr}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            Senha do server (Server Password):
            <input
              type="password"
              name="server_pass"
              value={formData.server_pass}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            Senha de gerência (Management Password):
            <input
              type="password"
              name="mgmt_pass"
              value={formData.mgmt_pass}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            Lista de IPs (IP List):
            <input
              type="text"
              name="ip_list"
              value={formData.ip_list}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            É cliente de relógio? (Clock Customer):
            <input
              type="checkbox"
              name="clock_customer"
              checked={formData.clock_customer}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Endereço do relógio (Clock Address):
            <input
              type="text"
              name="clock_addr"
              value={formData.clock_addr}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            Senha do sistema de relógio (Clock System Password):
            <input
              type="password"
              name="clock_system_pass"
              value={formData.clock_system_pass}
              onChange={handleInputChange}
              style={{ color: 'black' }}
            />
          </label>
          <br />
          <label>
            Tem equipe técnica? (Tech Team):
            <input
              type="checkbox"
              name="tech_team"
              checked={formData.tech_team}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <br />
          <div className="flex justify-between space-x-1">
          <button
                  type="button"
                  onClick={() => history.back()}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Voltar
          </button>
          <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Salvar
          </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default withAuth(ClientePage);
