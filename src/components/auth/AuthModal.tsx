
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
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const studioName = formData.get('studioName') as string;
    
    const { error } = await signUp(email, password, firstName, lastName, studioName);
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
            Materials Dashboard
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Streamline your material management workflow
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-3 text-center border-b-2 transition-colors ${
                activeTab === 'signin'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-3 text-center border-b-2 transition-colors ${
                activeTab === 'signup'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
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
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="studio-name" className="block text-sm font-medium text-gray-900 mb-2">
                  Studio Name
                </Label>
                <Input
                  id="studio-name"
                  name="studioName"
                  placeholder="Your studio name"
                  className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name" className="block text-sm font-medium text-gray-900 mb-2">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    placeholder="First name"
                    className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last-name" className="block text-sm font-medium text-gray-900 mb-2">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    placeholder="Last name"
                    className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signup-email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email address
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full h-12 px-4 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
