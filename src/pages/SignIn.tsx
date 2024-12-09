import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("Sign in attempt with email:", email);

    try {
      // First, check if the user exists
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: email
        }
      });

      if (getUserError) {
        console.error("Error checking user:", getUserError);
        throw getUserError;
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Provide specific error messages based on the error type
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email not verified",
            description: "Please check your email and verify your account before signing in.",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message,
          });
        }
        return;
      }

      console.log("Sign in successful:", data);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during sign in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Make sure to verify your email before signing in
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;