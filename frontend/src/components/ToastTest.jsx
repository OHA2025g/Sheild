import React from 'react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const ToastTest = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success",
      description: "This is a centered success notification!",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "This is a centered error notification!",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Toast Notification Test</h1>
        <div className="space-y-4">
          <Button 
            onClick={showSuccessToast}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Show Success Toast (Centered)
          </Button>
          <Button 
            onClick={showErrorToast}
            variant="destructive"
            className="w-full"
          >
            Show Error Toast (Centered)
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Click the buttons above to see the centered toast notifications
        </p>
      </div>
    </div>
  );
};

export default ToastTest;