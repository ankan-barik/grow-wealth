import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, XCircle, UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: "", isChecking: false });
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, message: "" });
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Email validation
  useEffect(() => {
    if (!email) {
      setEmailValidation({ isValid: false, message: "", isChecking: false });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
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
  }, [email]);
  
  // Password validation - simplified for testing
  useEffect(() => {
    if (!password) {
      setPasswordValidation({ isValid: false, message: "" });
      return;
    }

    if (password.length < 6) {
      setPasswordValidation({ 
        isValid: false, 
        message: "Password must be at least 6 characters long" 
      });
    } else {
      setPasswordValidation({ 
        isValid: true, 
        message: "Password meets requirements" 
      });
    }
  }, [password]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email format");
      return;
    }

    // Password validation - simplified
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Attempting registration with:', { 
        name: name.trim(), 
        email: email.toLowerCase(), 
        passwordLength: password.length 
      });
      
      // Call the register function from AuthContext
      await register(name.trim(), email.toLowerCase(), password);
      
      // If successful, navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getEmailValidationIcon = () => {
    if (emailValidation.isChecking) {
      return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (email && emailValidation.message) {
      return emailValidation.isValid ? 
        <CheckCircle className="h-4 w-4 text-green-500" /> : 
        <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getPasswordValidationIcon = () => {
    if (password && passwordValidation.message) {
      return passwordValidation.isValid ? 
        <CheckCircle className="h-4 w-4 text-green-500" /> : 
        <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getEmailValidationColor = () => {
    if (!email || !emailValidation.message) return "";
    return emailValidation.isValid ? "text-green-600" : "text-red-600";
  };

  const getPasswordValidationColor = () => {
    if (!password || !passwordValidation.message) return "";
    return passwordValidation.isValid ? "text-green-600" : "text-red-600";
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-green-200 to-indigo-400">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <Card className="shadow-lg border border-gray-200 bg-white rounded-xl">
          <CardHeader className="space-y-1 pb-2">
            {/* Account Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-green-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-500 via-green-600 to-emerald-500 bg-clip-text text-transparent">
  Create Your Expensia Account
</CardTitle>

            <CardDescription className="text-center text-gray-500">
              Join Expensia to start managing your finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black ${
                      email && emailValidation.message ? 
                      (emailValidation.isValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : ''
                    }`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getEmailValidationIcon()}
                  </div>
                </div>
                {email && emailValidation.message && (
                  <p className={`text-xs ${getEmailValidationColor()}`}>
                    {emailValidation.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-16 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black ${
                      password && passwordValidation.message ? 
                      (passwordValidation.isValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : ''
                    }`}
                    required
                  />
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    {getPasswordValidationIcon()}
                  </div>
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
                {password && passwordValidation.message && (
                  <p className={`text-xs ${getPasswordValidationColor()}`}>
                    {passwordValidation.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-black font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white text-black ${
                      confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500' : 
                      confirmPassword && password === confirmPassword && password ? 'border-green-500 focus:border-green-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password && (
                  <p className="text-xs text-green-600">
                    Passwords match
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg" 
                disabled={isSubmitting || !emailValidation.isValid || !passwordValidation.isValid}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              
              {/* Info Message */}
              <div className="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                <span className="text-gray-500">By creating an account, you agree to our terms and conditions</span>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 hover:text-red-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
