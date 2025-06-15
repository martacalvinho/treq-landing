
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to onboarding wizard for new users, dashboard for existing users
  if (user && !loading) {
    // Check if this is a new user by seeing if they have a studio_id
    const hasStudio = user.user_metadata?.studio_name || user.app_metadata?.studio_id;
    return <Navigate to={hasStudio ? "/onboarding-wizard" : "/dashboard"} replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    await signIn(email, password);
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
    
    await signUp(email, password, firstName, lastName, studioName);
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">
          Materials Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Streamline your material management workflow
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue="signin" className="w-full">
            <div className="px-8 pt-8">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0 mb-8">
                <TabsTrigger 
                  value="signin" 
                  className="relative rounded-none bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-base font-medium text-gray-500 data-[state=active]:text-gray-900 transition-colors"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="relative rounded-none bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-base font-medium text-gray-500 data-[state=active]:text-gray-900 transition-colors"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="signin" className="px-8 pb-8 mt-0">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="signin-email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email address
                  </Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
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
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="px-8 pb-8 mt-0">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="studio-name" className="block text-sm font-medium text-gray-900 mb-2">
                    Studio Name
                  </Label>
                  <Input
                    id="studio-name"
                    name="studioName"
                    placeholder="Your studio name"
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
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
                      className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
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
                      className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
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
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
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
                    className="w-full h-12 px-4 text-base border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
