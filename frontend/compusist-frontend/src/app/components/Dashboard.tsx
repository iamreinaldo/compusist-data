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
  const nome_usuario = localStorage.getItem('user_name')


  useEffect(() => {

    const storedName = localStorage.getItem('user_name');
    if (storedName){
      setName(storedName)
    }

    const buscarClientes = async () => {
      try {
        const response = await axios.get(`http://187.103.0.132:43940/customers/`);
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
    // @ts-ignore
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
        <div className='absolute top-4 right-4 flex items-center space-x-2 cursor-pointer' onClick={handleUserClick}>        
        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold'>
        {nome_usuario ? nome_usuario.charAt(0).toUpperCase() : ''}
        </div>
        <span onClick={handleUserClick} className="font-medium cursor-pointer hover:underline text-white font-bold">
            {nome_usuario}
        </span>
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
    // @ts-ignore
              key={cliente.id}
    // @ts-ignore
              onClick={() => handleClientClick(cliente.id)} // Redireciona para a página do cliente
              style={{ display: 'block', padding: '10px', marginBottom: '10px', width: '100%', textAlign: 'left', color: 'black' }}
            >
              {/*@ts-ignore*/}
              {cliente.name}
            </button>
          ))}
        </div>
        <button className="bg-green-500 hover:bg-green-600" onClick={handleNewClientClick} style={{color: 'white', padding: '10px', width: '100%', borderRadius: '5px' }}>
          + NOVO CLIENTE
        </button>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
