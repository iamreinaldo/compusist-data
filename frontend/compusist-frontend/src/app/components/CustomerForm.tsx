"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    contact: '',
    address: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/customers/', formData);
      alert('Cliente cadastrado com sucesso!');
      router.push('/dashboard'); // Redirecionar para a dashboard após o cadastro
    } catch (error) {
      alert('Erro ao cadastrar cliente');
      console.error(error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          CNPJ:
          <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
        </label>
        <label>
          Contato:
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
        </label>
        <label>
          Endereço:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <button type="submit">CADASTRAR</button>
        <button type="button" onClick={handleBack}>VOLTAR</button>
      </form>
    </div>
  );
};

export default CustomerForm;
