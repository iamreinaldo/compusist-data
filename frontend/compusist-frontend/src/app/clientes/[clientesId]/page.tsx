"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const ClientePage = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    network_customer: false,
    network: '',
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
  const clienteId = parseInt(params?.clientesId);

  useEffect(() => {
    if (clienteId) {
      const fetchCliente = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/customers/${clienteId}`);
          setCliente(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar cliente:', error);
          setLoading(false);
        }
      };

      fetchCliente();
    } else {
      console.error("ID do cliente não encontrado");
    }
  }, [clienteId]);

  const handleAddInfoClick = () => {
    setShowForm(true);
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
    try {
      const response = await axios.post('http://localhost:8000/customers/attributes', {
        ...formData,
        customer_id: Number(clienteId),
        user_id: 1, // Ajuste conforme necessário
      });
      console.log('Atributos adicionados:', response.data);
    } catch (error) {
      console.error('Erro ao adicionar atributos:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div>
      <h1>{cliente.name}</h1>
      <p><strong>CNPJ:</strong> {cliente.cnpj}</p>
      <p><strong>Contato:</strong> {cliente.contact}</p>
      <p><strong>Endereço:</strong> {cliente.address}</p>

      <button onClick={handleAddInfoClick}>
        Adicionar informações
      </button>

      {showForm && (
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
              style={{ color: 'black' }} // Somente o texto digitado será preto
            />
          </label>
          <br />
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
        </form>
      )}
    </div>
  );
};

export default ClientePage;
