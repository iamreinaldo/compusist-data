"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const withAuth = (WrappedComponent: React.FC) => {
    return (props: any) => {
      const router = useRouter();
      const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
      useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
        } else {
          setIsCheckingAuth(false);
        }
      }, [router]);

      if (isCheckingAuth){
        return null
      }
  
      return <WrappedComponent {...props} />;
    };
  };
  
  export default withAuth;