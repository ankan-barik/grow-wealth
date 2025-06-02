import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: "", isChecking: false });
  
  const { login, forgotPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Simple email format validation (no backend calls)
  useEffect(() => {
    if (!resetEmail || !showForgotPassword) {
      setEmailValidation({ isValid: false, message: "", isChecking: false });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(resetEmail)) {
      setEmailValidation({ 
        isValid: true, 
        message: "Email format is valid", 
        isChecking: false 
      });
    } else {
      setEmailValidation({ 
        isValid: false, 
        message: "Please enter a valid email format", 
        isChecking: false 
      });
    }
  }, [resetEmail, showForgotPassword]);
  
  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email format");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // This will call your backend login API through AuthContext
      await login(email, password);
      
      // Navigate to dashboard on successful login - handled by useEffect above
      // The AuthContext will show success toast automatically
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError("Please enter a valid email format");
      return;
    }
    
    try {
      setIsResetting(true);
      
      // Call the backend forgot password API through AuthContext
      const response = await forgotPassword(resetEmail);
      setResetMessage(response.message);
      setResetEmail("");
      setEmailValidation({ isValid: false, message: "", isChecking: false });
      
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error instanceof Error ? error.message : "Failed to send reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setError("");
    setResetMessage("");
    setResetEmail("");
    setEmailValidation({ isValid: false, message: "", isChecking: false });
  };

  const getEmailValidationIcon = () => {
    if (emailValidation.isChecking) {
      return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (resetEmail && emailValidation.message) {
      return emailValidation.isValid ? 
        <CheckCircle className="h-4 w-4 text-green-500" /> : 
        <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getEmailValidationColor = () => {
    if (!resetEmail || !emailValidation.message) return "";
    return emailValidation.isValid ? "text-green-600" : "text-red-600";
  };
  
 if (showForgotPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-green-200 to-indigo-400">
        <div className="w-full max-w-md p-4 animate-fade-in">
          <Card className="shadow-lg border border-gray-200 bg-white rounded-xl">
            <CardHeader className="space-y-1 pb-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={backToLogin}
                  className="p-1 h-8 w-8 hover:bg-gray-400 text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl font-bold text-blue-700">Reset Password</CardTitle>
              </div>
              <CardDescription className="text-center text-gray-600">
                Enter your email address and we'll send you instructions to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-black font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black ${
                        resetEmail && emailValidation.message ? 
                        (emailValidation.isValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : ''
                      }`}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getEmailValidationIcon()}
                    </div>
                  </div>
                  {resetEmail && emailValidation.message && (
                    <p className={`text-xs ${getEmailValidationColor()}`}>
                      {emailValidation.message}
                    </p>
                  )}
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}
                
                {resetMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600 text-sm font-medium">{resetMessage}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-lg" 
                  disabled={isResetting || emailValidation.isChecking || !emailValidation.isValid}
                >
                  {isResetting ? "Sending..." : "Send Reset Email"}
                </Button>
                
                <div className="text-xs text-gray-600 text-center">
                  <p>Reset link will be valid for 1 hour</p>
                  <p>Check your spam folder if you don't see the email</p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button 
                  onClick={backToLogin}
                  className="text-red-600 hover:text-red-700 hover:underline font-medium"
                >
                  Back to Login
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-green-200 to-indigo-400">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <Card className="shadow-lg border border-gray-200 bg-white rounded-xl">
          <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-500 via-green-600 to-emerald-600 bg-clip-text text-transparent">
  Welcome To Expensia
</CardTitle>


            <CardDescription className="text-center text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-blue-200 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-black font-medium">Password</Label>
                  
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-red-600 hover:text-red-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-sm text-center text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                <span className="text-gray-500">Create an account to get started</span>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-600 hover:text-red-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
