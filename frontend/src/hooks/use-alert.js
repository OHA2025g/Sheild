import { useState, useCallback } from 'react';

export function useAlert() {
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    variant: 'default', // 'default' or 'destructive'
  });

  const showAlert = useCallback(({ title, description, variant = 'default' }) => {
    setAlert({
      open: true,
      title,
      description,
      variant,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, open: false }));
  }, []);

  return {
    alert,
    showAlert,
    closeAlert,
  };
}

