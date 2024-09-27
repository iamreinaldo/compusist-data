"use client"
import CustomerForm from '../components/CustomerForm';
import { useRouter } from 'next/navigation';
import { Terminal } from "lucide-react"
import withAuth from '@/app/components/withAuth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from 'react';


const AddClient = () => {
    const router = useRouter();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleCustomerSubmit = async (customerData: { name: string; cnpj: string; contact: string; address: string }) => {
      try {
        const response = await fetch('http://localhost:8000/customers/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(customerData),
        });
        
        if (response.ok) {
          setShowSuccessAlert(true);
          setShowErrorAlert(false)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setShowSuccessAlert(false)
          setShowErrorAlert(true)
        }
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao cadastrar o cliente');
      }
    };
    
    return (
      <div>
        {showSuccessAlert && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}>
          <Alert>
          <Terminal className='h-4 w-4' />
          <AlertTitle>Maravilha!</AlertTitle>
          <AlertDescription>
            Cliente cadastrado com sucesso!
          </AlertDescription>
        </Alert>
        </div>
        )}

        {showErrorAlert && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}>
          <Alert variant="destructive">
            <Terminal className='h-4 w-4' />
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao cadastrar o cliente. Tente novamente.
            </AlertDescription>
          </Alert>
          </div>
        )}


      <CustomerForm onSubmit={handleCustomerSubmit} />
    </div>
  );
};


export default withAuth(AddClient);
