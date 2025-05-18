
import React from "react";
import { Navbar } from "@/components/Navbar";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { useSignIn } from "@/hooks/useSignIn";

const SignIn = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isResettingPassword,
    handleSignIn,
    handleResetPassword
  } = useSignIn();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            onSubmit={handleSignIn}
          />
          <AuthLinks
            email={email}
            isResettingPassword={isResettingPassword}
            onResetPassword={handleResetPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
