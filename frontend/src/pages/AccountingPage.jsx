import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartBar, TrendUp, TrendDown, CurrencyDollar, Calendar } from "@phosphor-icons/react";

export default function AccountingPage() {
  const [tab, setTab] = useState("daily");
  const [dailyReport, setDailyReport] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ category: "", description: "", amount: "", expense_date: new Date().toISOString().split("T")[0] });
  const [expenses, setExpenses] = useState([]);

  const loadDailyReport = async () => {
    setLoading(true);
    try { const { data } = await api.get("/accounting/daily-sales", { params: { report_date: reportDate } }); setDailyReport(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadIncomeStatement = async () => {
    setLoading(true);
    try { const { data } = await api.get("/accounting/income-statement", { params: { start_date: startDate, end_date: endDate } }); setIncomeStatement(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadBalanceSheet = async () => {
    setLoading(true);
    try { const { data } = await api.get("/accounting/balance-sheet"); setBalanceSheet(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadExpenses = async () => {
    try { const { data } = await api.get("/expenses"); setExpenses(data || []); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (tab === "daily") loadDailyReport();
    if (tab === "income") loadIncomeStatement();
    if (tab === "balance") loadBalanceSheet();
    if (tab === "expenses") loadExpenses();
  }, [tab]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try { await api.post("/expenses", { ...expenseForm, amount: parseFloat(expenseForm.amount) }); loadExpenses(); setShowExpenseForm(false); setExpenseForm({ category: "", description: "", amount: "", expense_date: new Date().toISOString().split("T")[0] }); }
    catch (err) { console.error(err); }
  };

  const MetricCard = ({ label, value, trend, color = "navy" }) => (
    <div className="bg-white border border-beige-300 rounded-2xl p-5 shadow-[0_4px_20px_rgba(19,29,51,0.03)]">
      <p className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500 mb-2">{label}</p>
      <p className={`text-2xl font-heading font-medium ${color === "success" ? "text-status-success" : color === "danger" ? "text-status-danger" : "text-navy-900"}`}>
        Rs {(typeof value === "number" ? value : parseFloat(value || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? "text-status-success" : "text-status-danger"}`}>
          {trend >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "daily", label: "Daily Sales" },
    { id: "income", label: "Income Statement" },
    { id: "balance", label: "Balance Sheet" },
    { id: "expenses", label: "Expenses" },
  ];

  return (
    <div data-testid="accounting-page" className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-medium text-navy-900 tracking-tight">Accounting</h1>
        <p className="text-navy-500 mt-1">Financial reports, income statements, and balance sheets</p>
      </div>

      <div className="flex gap-1 bg-beige-200 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Daily Sales Report */}
      {tab === "daily" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-navy-500" />
            <Input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="w-48 bg-white border-beige-300 rounded-xl" />
            <Button onClick={loadDailyReport} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">Load Report</Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>
          ) : dailyReport && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard label="Revenue" value={dailyReport.total_revenue} color="success" />
                <MetricCard label="COGS" value={dailyReport.cogs} />
                <MetricCard label="Gross Profit" value={dailyReport.gross_profit} color={dailyReport.gross_profit >= 0 ? "success" : "danger"} />
                <MetricCard label="Transactions" value={dailyReport.transaction_count} />
              </div>
              {dailyReport.payment_breakdown && Object.keys(dailyReport.payment_breakdown).length > 0 && (
                <div className="bg-white border border-beige-300 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-beige-500 mb-3">Payment Breakdown</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(dailyReport.payment_breakdown).map(([method, amount]) => (
                      <div key={method} className="bg-beige-50 rounded-xl p-3">
                        <p className="text-xs text-navy-500 capitalize">{method}</p>
                        <p className="text-lg font-heading font-medium text-navy-900">Rs {parseFloat(amount).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Income Statement */}
      {tab === "income" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44 bg-white border-beige-300 rounded-xl" />
            <span className="text-navy-500">to</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-44 bg-white border-beige-300 rounded-xl" />
            <Button onClick={loadIncomeStatement} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">Generate</Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>
          ) : incomeStatement && (
            <div className="bg-white border border-beige-300 rounded-2xl p-6 max-w-xl">
              <h3 className="font-heading font-medium text-navy-900 text-lg mb-4">Income Statement</h3>
              <p className="text-xs text-navy-500 mb-4">{incomeStatement.period?.start} to {incomeStatement.period?.end}</p>
              <div className="space-y-3">
                <div className="flex justify-between py-2"><span className="text-navy-700">Revenue</span><span className="font-medium text-navy-900">Rs {incomeStatement.revenue?.toLocaleString()}</span></div>
                <div className="flex justify-between py-2"><span className="text-navy-500">(-) Cost of Goods Sold</span><span className="text-navy-700">Rs {incomeStatement.cogs?.toLocaleString()}</span></div>
                <div className="flex justify-between py-2 border-t border-beige-300 font-medium"><span className="text-navy-900">Gross Profit</span><span className={incomeStatement.gross_profit >= 0 ? "text-status-success" : "text-status-danger"}>Rs {incomeStatement.gross_profit?.toLocaleString()}</span></div>
                <div className="flex justify-between py-2"><span className="text-navy-500">(-) Operating Expenses</span><span className="text-navy-700">Rs {incomeStatement.operating_expenses?.toLocaleString()}</span></div>
                {incomeStatement.expense_breakdown && Object.entries(incomeStatement.expense_breakdown).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between py-1 pl-4"><span className="text-xs text-navy-500 capitalize">{cat}</span><span className="text-xs text-navy-500">Rs {amt.toLocaleString()}</span></div>
                ))}
                <div className="flex justify-between py-3 border-t-2 border-navy-800 font-bold text-lg"><span className="text-navy-900">Net Income</span><span className={incomeStatement.net_income >= 0 ? "text-status-success" : "text-status-danger"}>Rs {incomeStatement.net_income?.toLocaleString()}</span></div>
                <div className="flex gap-4 text-xs text-navy-500 pt-2">
                  <span>Gross Margin: {incomeStatement.gross_margin}%</span>
                  <span>Net Margin: {incomeStatement.net_margin}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Balance Sheet */}
      {tab === "balance" && (
        <div className="space-y-6">
          <Button onClick={loadBalanceSheet} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">Refresh</Button>
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /></div>
          ) : balanceSheet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="bg-white border border-beige-300 rounded-2xl p-6">
                <h3 className="font-heading font-medium text-navy-900 text-lg mb-4">Assets</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2"><span className="text-navy-700">Cash & Equivalents</span><span className="text-navy-900">Rs {balanceSheet.assets?.cash?.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2"><span className="text-navy-700">Inventory (Finished Goods)</span><span className="text-navy-900">Rs {balanceSheet.assets?.inventory?.toLocaleString()}</span></div>
                  <div className="flex justify-between py-2"><span className="text-navy-700">Raw Materials</span><span className="text-navy-900">Rs {balanceSheet.assets?.raw_materials?.toLocaleString()}</span></div>
                  <div className="flex justify-between py-3 border-t-2 border-navy-800 font-bold"><span>Total Assets</span><span>Rs {balanceSheet.assets?.total_assets?.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-white border border-beige-300 rounded-2xl p-6">
                <h3 className="font-heading font-medium text-navy-900 text-lg mb-4">Equity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2"><span className="text-navy-700">Retained Earnings</span><span className="text-navy-900">Rs {balanceSheet.equity?.retained_earnings?.toLocaleString()}</span></div>
                  <div className="flex justify-between py-3 border-t-2 border-navy-800 font-bold"><span>Total Equity</span><span>Rs {balanceSheet.equity?.total_equity?.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {tab === "expenses" && (
        <div className="space-y-6">
          <Button onClick={() => setShowExpenseForm(true)} className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl"><Plus size={18} className="mr-2" /> Add Expense</Button>
          <div className="bg-white border border-beige-300 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(19,29,51,0.03)]">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-navy-500">No expenses recorded</div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-beige-100">
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider font-bold text-navy-500">Date</th>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider font-bold text-navy-500">Category</th>
                <th className="text-left py-3 px-6 text-xs uppercase tracking-wider font-bold text-navy-500">Description</th>
                <th className="text-right py-3 px-6 text-xs uppercase tracking-wider font-bold text-navy-500">Amount</th>
              </tr></thead><tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} className="border-b border-beige-200 hover:bg-beige-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-navy-700">{exp.expense_date}</td>
                    <td className="py-3 px-6"><span className="text-xs px-2 py-1 rounded-lg bg-beige-200 text-navy-700 capitalize">{exp.category}</span></td>
                    <td className="py-3 px-6 text-sm text-navy-700">{exp.description || "—"}</td>
                    <td className="py-3 px-6 text-sm text-navy-900 font-medium text-right">Rs {parseFloat(exp.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody></table></div>
            )}
          </div>
          {showExpenseForm && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowExpenseForm(false)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-heading font-medium text-navy-900 text-xl mb-4">Add Expense</h3>
                <form onSubmit={handleAddExpense} className="space-y-3">
                  <select data-testid="expense-category" value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})} required className="w-full bg-white border border-beige-300 rounded-xl px-4 py-3 text-sm text-navy-900">
                    <option value="">Select Category</option>
                    <option value="rent">Rent</option><option value="utilities">Utilities</option><option value="salaries">Salaries</option><option value="transport">Transport</option><option value="maintenance">Maintenance</option><option value="marketing">Marketing</option><option value="other">Other</option>
                  </select>
                  <Input value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} placeholder="Description" className="bg-white border-beige-300 rounded-xl" />
                  <Input data-testid="expense-amount" type="number" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})} placeholder="Amount" required className="bg-white border-beige-300 rounded-xl" />
                  <Input type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm({...expenseForm, expense_date: e.target.value})} className="bg-white border-beige-300 rounded-xl" />
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-navy-800 text-white hover:bg-navy-700 rounded-xl">Add Expense</Button>
                    <Button type="button" onClick={() => setShowExpenseForm(false)} className="bg-beige-200 text-navy-900 hover:bg-beige-300 rounded-xl">Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
