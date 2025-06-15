
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const { error } = await signIn(email, password);
    if (!error) {
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto bg-white">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Sign In to Treqy
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Access your material dashboard
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="signin-email" className="block text-sm font-medium text-gray-900 mb-2">
                Email address
              </Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                required
              />
            </div>
            <div>
              <Label htmlFor="signin-password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </Label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? <a href="/get-started" className="text-coral hover:underline">Get started here</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
