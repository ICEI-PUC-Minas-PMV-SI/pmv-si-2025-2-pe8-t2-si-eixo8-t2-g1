
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const homePath = isAuthenticated ? "/dashboard" : "/";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-clinic-teal mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Oops! Página não encontrada</p>
          <Button asChild>
            <Link to={homePath} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
