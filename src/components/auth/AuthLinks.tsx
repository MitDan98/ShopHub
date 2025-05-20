
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthLinksProps {
  email?: string; // Make email optional
  isResettingPassword?: boolean; // Make isResettingPassword optional
  onResetPassword?: () => void; // Make onResetPassword optional
}

export const AuthLinks = ({ 
  email = "", 
  isResettingPassword = false, 
  onResetPassword = () => console.log("Reset password action") 
}: AuthLinksProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 flex flex-col space-y-4">
      <Button
        variant="link"
        className="text-sm text-blue-600 hover:text-blue-800"
        onClick={onResetPassword}
        disabled={isResettingPassword}
      >
        {isResettingPassword ? "Sending reset link..." : "Forgot Password?"}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </p>
    </div>
  );
};
