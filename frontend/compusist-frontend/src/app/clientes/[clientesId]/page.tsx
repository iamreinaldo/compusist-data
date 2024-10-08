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
          const responseCliente = await axios.get(`http://localhost:8000/customers/${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
          });
          setCliente(responseCliente.data);
          
          // Buscar os atributos do cliente
          const responseAtributos = await axios.get(`http://localhost:8000/customers/attributes/${clienteId}`, {
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

  const handleCancel = () => {
    setShowForm(false); // Fecha o formulário
  };

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
        const response = await fetch(`http://localhost:8000/customers/attributes/${clienteId}`, {
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
        const response = await fetch('http://localhost:8000/customers/attributes', {
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
        const response = await axios.delete(`http://localhost:8000/customers/attributes/${clienteId}`);
        
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
        <Image src={logo} onClick={handleLogoClick}  alt="Logo" style={{ height: '50px', cursor: 'pointer' }}  />
        <div>
          <span onClick={handleUserClick} style={{cursor:'pointer', color:'green'}}>{nome_usuario}</span>
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
      <Image src={logo} onClick={handleLogoClick}  alt="Logo" style={{ height: '50px', cursor: 'pointer' }}  />
      <div>
          <span onClick={handleUserClick} style={{cursor:'pointer', color:'green'}}>{nome_usuario}</span>
        </div>
        </div>
        <div>Cliente não encontrado</div>
      </div>
      )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px' }}>
    <Image src={logo} onClick={handleLogoClick}  alt="Logo" style={{ height: '50px', cursor: 'pointer' }}  />
    <div>
        <span onClick={handleUserClick} style={{cursor:'pointer', color:'green'}}>{nome_usuario}</span>
      </div>
    </div>
    <div>
      <h1><strong>{cliente.name}</strong></h1>
      <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
      <p><strong>Contato:</strong> {cliente.contact}</p>
      <p><strong>Endereço:</strong> {cliente.address}</p>
    </div>

      {/* Exibir mensagem de erro caso haja */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Se o cliente tiver atributos, exibi-los */}
      {atributos ? (
        <div style={{ width: '300px', backgroundColor: '#000000', padding: '20px', borderRadius: '8px' }}>
        <div>
          <br />
          <h2>Informações do Cliente</h2>
          <ul>
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
          <button onClick={handleEditInfoClick}>Editar informações</button>
          <br />
          <button onClick={handleDelete}>Deletar informações</button>
        </div>
        </div>
      ) : (
        // Caso não tenha atributos, exibir o botão para adicionar
        <button onClick={handleAddInfoClick}>
          Adicionar informações
        </button>
      )}

      {showForm && (
        <div style={{ width: '300px', backgroundColor: '#000000', padding: '20px', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
          <button type="submit">Enviar</button>
          <br />
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </form>
        </div>
      )}
    </div>
  );
};

export default withAuth(ClientePage);
