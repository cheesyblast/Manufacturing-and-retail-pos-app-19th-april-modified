import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "cashier") navigate("/pos");
      else if (user.role === "production_staff") navigate("/manufacturing");
      else navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://static.prod-images.emergentagent.com/jobs/9efb1b10-3182-4939-931e-3975c608d93e/images/daae9b06d8d8cbb60aa71e5c69afa4130e34abc24462812224d1dcf7d966235e.png"
          alt="Textile"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/40" />
        <div className="relative z-10 flex flex-col justify-end h-full p-12">
          <h1 className="text-4xl sm:text-5xl font-heading font-medium text-white tracking-tight mb-3">
            Textile ERP
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            End-to-end manufacturing, inventory, and retail management.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-beige-100">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://static.prod-images.emergentagent.com/jobs/9efb1b10-3182-4939-931e-3975c608d93e/images/fc3fe8419e8ec531202d0fb5cfb69d923536da9c0eca71d51c578fb78b1ad5ee.png"
              alt="Logo"
              className="w-10 h-10"
            />
            <span className="font-heading text-xl font-medium text-navy-800">TextileERP</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-medium text-navy-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-navy-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div data-testid="login-error" className="bg-status-danger-bg border border-status-danger/20 text-status-danger px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-700 font-medium text-sm">Email</Label>
              <Input
                data-testid="login-email-input"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@erp.com"
                className="bg-white border-beige-300 rounded-xl px-4 py-3 text-navy-900 focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy-700 font-medium text-sm">Password</Label>
              <Input
                data-testid="login-password-input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-white border-beige-300 rounded-xl px-4 py-3 text-navy-900 focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                required
              />
            </div>

            <Button
              data-testid="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full bg-navy-800 text-white hover:bg-navy-700 rounded-xl px-6 py-3 font-medium h-12 text-base transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-navy-500">
            Default: admin@erp.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
