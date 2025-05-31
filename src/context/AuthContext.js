
import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [auth, setAuth] = useState(() => (localStorage.getItem('access_token') !== null ? true : false));

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setAuth(true);
        } else {
            setAuth(false);
            if (window.location.pathname !== "/login") {
                navigate('/login');
            }
        }
    }, []);

    
    const submitLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const phone_number = e.target.phone_number.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(
                'https://potion.dev.gumisofts.com/platform_admin/admin_platform_login/',
                { phone_number, password },
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true,
                }
            );

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                setAuth(true);
                navigate('/');
            } else {
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            setError('Invalid phone number or password. Please try again.');
        }
    };

    const submitLogout = async () => {

        const accessToken = localStorage.getItem('access_token');

        if (accessToken !== null) {
            localStorage.clear();
            setAuth(false)
            navigate('/login');
            return;
        }


    };

    const allUsers = async () => {
        const accessToken = localStorage.getItem('access_token');
      
        try {
          const response = await axios.get('https://potion.dev.gumisofts.com/platform_admin/all_users/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return response.data;
        } catch (e) {
          localStorage.clear();
          console.error('Not authenticated:', e);
        }
    };


    const transactionRecord = async () => {
        const accessToken = localStorage.getItem('access_token');
      
        try {
          const response = await axios.get('https://potion.dev.gumisofts.com/platform_admin/transaction-records/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return response.data;
        } catch (e) {
          localStorage.clear();
          console.error('Not authenticated:', e);
        }
    };


    const disputeRecords = async () => {
        const accessToken = localStorage.getItem('access_token');
      
        try {
          const response = await axios.get('https://potion.dev.gumisofts.com/platform_admin/dispute-records/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return response.data;
        } catch (e) {
          localStorage.clear();
          console.error('Not authenticated:', e);
        }
    };

    const businessRecords = async () => {
      const accessToken = localStorage.getItem('access_token');
    
      try {
        const response = await axios.get('https://potion.dev.gumisofts.com/platform_admin/business-records/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data;
      } catch (e) {
        localStorage.clear();
        console.error('Not authenticated:', e);
      }
  };

  const disputeInReview = async (disputeId) => {
    const accessToken = localStorage.getItem('access_token');
  
    try {
      const response = await axios.patch(`https://potion.dev.gumisofts.com/platform_admin/dispute-records/${disputeId}/move-to-review/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (e) {
      localStorage.clear();
      console.error('Not authenticated:', e);
    }
};

  const disputeReviewed = async (disputeId) => {
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await axios.patch(`https://potion.dev.gumisofts.com/platform_admin/dispute-records/${disputeId}/mark-as-reviewed/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (e) {
      localStorage.clear();
      console.error('Not authenticated:', e);
    }
  };

  const disputeResolved = async (disputeId, notes) => {
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await axios.patch(`https://potion.dev.gumisofts.com/platform_admin/dispute-records/${disputeId}/process-refund/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("disputesdata:", response.data)
      return response.data;
    } catch (e) {
      localStorage.clear();
      console.error('Not authenticated:', e);
    }
  };

    const ctx = {
        submitLogin,
        submitLogout,
        allUsers,
        transactionRecord,
        disputeRecords,
        businessRecords,
        disputeInReview,
        disputeReviewed,
        disputeResolved,
        auth,
        message,
        error,
    };

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
