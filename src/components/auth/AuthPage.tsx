
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex flex-col">
      {/* Header with back button */}
      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to
              <br />
              <span className="text-coral bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent">
                Materials Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Your studio's material memory awaits
            </p>
          </div>

          {/* Auth Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <Tabs defaultValue="signin" className="w-full">
              {/* Custom Tab Navigation */}
              <div className="border-b border-gray-100">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="signin" 
                    className="relative rounded-none bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-coral data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6 text-base font-medium text-gray-500 data-[state=active]:text-coral transition-all duration-200 hover:text-gray-700"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="relative rounded-none bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-coral data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6 text-base font-medium text-gray-500 data-[state=active]:text-coral transition-all duration-200 hover:text-gray-700"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Sign In Form */}
              <TabsContent value="signin" className="p-8 mt-0">
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
                      className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
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
                      className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-coral hover:bg-coral-600 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" 
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
              
              {/* Sign Up Form */}
              <TabsContent value="signup" className="p-8 mt-0">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div>
                    <Label htmlFor="studio-name" className="block text-sm font-medium text-gray-900 mb-2">
                      Studio Name
                    </Label>
                    <Input
                      id="studio-name"
                      name="studioName"
                      placeholder="Your studio name"
                      className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
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
                        className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
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
                        className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
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
                      className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
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
                      className="w-full h-12 px-4 text-base border-gray-200 rounded-xl focus:border-coral focus:ring-coral transition-colors"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-coral hover:bg-coral-600 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" 
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
          
          {/* Footer text */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-12 h-12 bg-coral/10 rounded-full animate-pulse hidden lg:block"></div>
          <div className="absolute bottom-20 left-10 w-8 h-8 bg-blue-400/10 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
