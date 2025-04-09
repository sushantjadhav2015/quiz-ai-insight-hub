
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the landing page
    navigate('/');
  }, [navigate]);

  return null; // This component won't render anything as it immediately redirects
};

export default Index;
