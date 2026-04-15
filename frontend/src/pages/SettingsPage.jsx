import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gear, FloppyDisk } from "@phosphor-icons/react";
import { toast } from "sonner";

const settingFields = [
  { key: "business_name", label: "Business Name", placeholder: "TextileERP Retail" },
  { key: "business_address", label: "Business Address", placeholder: "123 Main Street" },
  { key: "business_phone", label: "Business Phone", placeholder: "+94 77 123 4567" },
  { key: "tax_rate", label: "Tax Rate (%)", placeholder: "0" },
  { key: "currency", label: "Currency Symbol", placeholder: "Rs" },
  { key: "sms_api_key", label: "SMS API Key (notify.lk)", placeholder: "Configure later" },
  { key: "sms_sender_id", label: "SMS Sender ID", placeholder: "Configure later" },
  { key: "email_smtp_host", label: "SMTP Host", placeholder: "smtp.gmail.com" },
  { key: "email_smtp_port", label: "SMTP Port", placeholder: "587" },
  { key: "email_username", label: "Email Username", placeholder: "your@email.com" },
  { key: "email_password", label: "Email Password", placeholder: "Configure later" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await api.get("/settings"); setSettings(data || {}); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveSetting = async (key) => {
    setSaving(true);
    try {
      await api.put("/settings", { key, value: settings[key] || "" });
      toast.success("Setting saved");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const field of settingFields) {
        if (settings[field.key]) {
          await api.put("/settings", { key: field.key, value: settings[field.key] });
        }
      }
      toast.success("All settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div data-testid="settings-page" className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-navy-900 tracking-tight">Settings</h1>
          <p className="text-navy-500 mt-1">Configure business details, SMS, and email</p>
        </div>
        <Button onClick={saveAll} disabled={saving} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">
          <FloppyDisk size={18} className="mr-2" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-beige-300 rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-medium text-navy-900 flex items-center gap-2"><Gear size={18} /> Business Details</h3>
          {settingFields.slice(0, 5).map(field => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500">{field.label}</label>
              <Input
                data-testid={`setting-${field.key}`}
                value={settings[field.key] || ""}
                onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                placeholder={field.placeholder}
                className="bg-white border-beige-300 rounded-xl"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-beige-300 rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-medium text-navy-900">SMS Settings (notify.lk)</h3>
          <p className="text-sm text-navy-500">Configure your notify.lk API credentials for sending digital receipts via SMS.</p>
          {settingFields.slice(5, 7).map(field => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500">{field.label}</label>
              <Input
                data-testid={`setting-${field.key}`}
                value={settings[field.key] || ""}
                onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                placeholder={field.placeholder}
                className="bg-white border-beige-300 rounded-xl"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-beige-300 rounded-2xl p-6 space-y-4">
          <h3 className="font-heading font-medium text-navy-900">Email Settings (SMTP)</h3>
          <p className="text-sm text-navy-500">Configure SMTP for sending email receipts and notifications.</p>
          {settingFields.slice(7).map(field => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500">{field.label}</label>
              <Input
                data-testid={`setting-${field.key}`}
                value={settings[field.key] || ""}
                onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                placeholder={field.placeholder}
                type={field.key.includes("password") ? "password" : "text"}
                className="bg-white border-beige-300 rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
