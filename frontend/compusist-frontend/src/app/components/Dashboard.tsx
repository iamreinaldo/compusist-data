"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import withAuth from './withAuth';
import Image from 'next/image';
import logo from "../Logo.png"

const Dashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {

    const storedName = localStorage.getItem('user_name');
    if (storedName){
      setName(storedName)
    }

    const buscarClientes = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/customers/`);
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    buscarClientes();
  }, [busca]);

  const handleNewClientClick = () => {
    router.push('/add-client'); // Redireciona para a página de cadastro de novo cliente
  };

  const handleClientClick = (clienteId) => {
    router.push(`/clientes/${clienteId}`); // Redireciona para a página do cliente
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = () => {
    router.push('/user');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <title>Dashboard</title>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px' }}>
        <Image src={logo} onClick={handleLogoClick}  alt="Logo" style={{ height: '50px', cursor: 'pointer' }}  />
        <div>
          <p>Olá, <span onClick={handleUserClick} style={{cursor:'pointer', color:'green'}}>{name}</span></p>
        </div>
      </div>
      <div style={{ width: '300px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Buscar cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ color: 'black', padding: '10px', width: '100%', marginBottom: '20px' }}
        />
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredClientes.map(cliente => (
            <button
              key={cliente.id}
              onClick={() => handleClientClick(cliente.id)} // Redireciona para a página do cliente
              style={{ display: 'block', padding: '10px', marginBottom: '10px', width: '100%', textAlign: 'left', color: 'black' }}
            >
              {cliente.name}
            </button>
          ))}
        </div>
        <button onClick={handleNewClientClick} style={{ backgroundColor: 'green', color: 'white', padding: '10px', width: '100%', borderRadius: '5px' }}>
          + NOVO CLIENTE
        </button>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
