"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../withAuth';

interface CustomerFormProps {
  onSubmit: (customerData: {
    name: string;
    cnpj: string;
    contact: string;
    address: string;
  }) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const nome_usuario = localStorage.getItem('user_name')
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, cnpj, contact, address });
  };

  const handleUserClick = () => {
    router.push('/user');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: 'black' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px' }}>
        <img src="/Logo.png" alt="Logo" style={{ height: '50px' }} />
        <div>
        <span onClick={handleUserClick} style={{color: 'green', cursor: 'pointer'}}>{nome_usuario}</span>
        </div>
      </div>
      <div style={{ width: '300px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">Cadastrar Cliente</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nome do Cliente"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="CNPJ do Cliente"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contato
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contato do Cliente"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Endereço do Cliente"
              required
            />
          </div>

          <div className="flex justify-between">
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
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
  );
};

export default withAuth(CustomerForm);
