import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Database, Check, Warning, Copy, ArrowRight } from "@phosphor-icons/react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function SetupPage() {
  const [status, setStatus] = useState(null);
  const [migrationSql, setMigrationSql] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const checkSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/setup/check`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Setup check error:", err);
      setStatus({ all_tables_ready: false, tables: {} });
    } finally {
      setLoading(false);
    }
  };

  const loadMigration = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/setup/migration-sql`);
      const data = await res.json();
      setMigrationSql(data.sql || "");
    } catch (err) {
      console.error("Migration SQL error:", err);
      setMigrationSql("-- Could not load migration SQL. Check backend connection.");
    }
  };

  useEffect(() => {
    checkSetup();
    loadMigration();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status?.all_tables_ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6" data-testid="setup-page">
        <div className="flex items-center gap-3">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/9efb1b10-3182-4939-931e-3975c608d93e/images/fc3fe8419e8ec531202d0fb5cfb69d923536da9c0eca71d51c578fb78b1ad5ee.png"
            alt="Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-heading font-medium text-navy-900">TextileERP Setup</h1>
        </div>

        <div className="bg-white border border-beige-300 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database size={24} className="text-navy-700" />
            <h2 className="text-xl font-heading font-medium text-navy-900">Database Setup Required</h2>
          </div>
          
          <p className="text-navy-600 mb-4">
            The database tables need to be created in your Supabase project. Follow these steps:
          </p>

          <ol className="space-y-3 text-sm text-navy-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="bg-navy-800 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
              <span>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-navy-800 underline font-medium">Supabase Dashboard</a></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-navy-800 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
              <span>Go to <strong>SQL Editor</strong> (left sidebar)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-navy-800 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
              <span>Click <strong>New Query</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-navy-800 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">4</span>
              <span>Paste the SQL below and click <strong>Run</strong></span>
            </li>
          </ol>

          {/* Table Status */}
          {status && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500 mb-2">Table Status</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(status.tables || {}).map(([table, st]) => (
                  <div key={table} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${st === "ok" ? "bg-status-success-bg text-status-success" : "bg-status-danger-bg text-status-danger"}`}>
                    {st === "ok" ? <Check size={12} /> : <Warning size={12} />}
                    {table}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Migration SQL */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500">Migration SQL</p>
              <Button onClick={copyToClipboard} size="sm" className="bg-beige-200 text-navy-700 hover:bg-beige-300 rounded-lg text-xs h-7 px-3">
                <Copy size={12} className="mr-1" /> {copied ? "Copied!" : "Copy SQL"}
              </Button>
            </div>
            <pre className="bg-navy-900 text-beige-200 p-4 rounded-xl text-xs overflow-auto max-h-64 font-mono leading-relaxed">
              {migrationSql}
            </pre>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={checkSetup} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">
            <ArrowRight size={18} className="mr-2" /> Check Again
          </Button>
          <Button onClick={() => window.location.href = "/login"} className="bg-beige-200 text-navy-900 hover:bg-beige-300 rounded-xl">
            Skip to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
