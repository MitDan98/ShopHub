import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/UserProfile";

const Index = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {session && <UserProfile session={session} />}
      <Hero />
      <FeaturedProducts />
    </div>
  );
};

export default Index;