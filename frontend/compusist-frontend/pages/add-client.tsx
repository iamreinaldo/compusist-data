import CustomerForm from '../src/app/components/CustomerForm';
import { useRouter } from 'next/navigation';

const AddClient = () => {
    const router = useRouter();
    const handleCustomerSubmit = async (customerData: { name: string; cnpj: string; contact: string; address: string }) => {
      try {
        const response = await fetch('http://localhost:8000/customers/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });
        
        if (response.ok) {
          alert('Cliente cadastrado com sucesso!');
          router.push('/')
        } else {
          alert('Erro ao cadastrar o cliente');
        }
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao cadastrar o cliente');
      }
    };
    
    return (
      <div>
      <CustomerForm onSubmit={handleCustomerSubmit} />
    </div>
  );
};


export default AddClient;
