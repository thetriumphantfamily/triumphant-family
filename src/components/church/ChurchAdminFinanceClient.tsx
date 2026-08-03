// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN FINANCE CLIENT – Full church finance management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

// ── Types ──
interface Income {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  received_by: string | null;
  income_date: string;
  recorded_by: string;
  created_at: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  paid_to: string | null;
  expense_date: string;
  receipt_url: string | null;
  recorded_by: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  target_amount: number;
  raised_amount: number;
  status: string;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
}

interface Pledge {
  id: string;
  member_name: string;
  member_id: string | null;
  pledge_amount: number;
  paid_amount: number;
  purpose: string | null;
  pledge_date: string;
  due_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

type ActiveTab = "dashboard" | "income" | "expenses" | "projects" | "pledges";

const INCOME_CATEGORIES = [
  "Tithe", "Sunday Offering", "Wednesday Offering",
  "First Fruit", "Building Fund", "Mission Fund",
  "Special Seed", "Welfare", "Project Offering", "Other",
];

const EXPENSE_CATEGORIES = [
  "Utility Bills", "Church Rent", "Staff Salary",
  "Event/Program", "Maintenance", "Equipment",
  "Missions/Outreach", "Welfare/Benevolence",
  "Stationery", "Transportation", "Other",
];

function formatAmount(n: number) {
  return "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 0 });
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function ChurchAdminFinanceClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [loading, setLoading] = useState(true);

  // Data
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);

  // Forms
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [incomeForm, setIncomeForm] = useState({
    category: "Tithe", amount: "", description: "",
    received_by: "", income_date: getLocalToday(),
  });

  const [expenseForm, setExpenseForm] = useState({
    category: "Utility Bills", amount: "", description: "",
    paid_to: "", expense_date: getLocalToday(),
  });

  const [projectForm, setProjectForm] = useState({
    name: "", description: "", target_amount: "",
    start_date: getLocalToday(), target_date: "",
  });

  const [pledgeForm, setPledgeForm] = useState({
    member_name: "", member_id: "", pledge_amount: "",
    paid_amount: "0", purpose: "",
    pledge_date: getLocalToday(), due_date: "", notes: "",
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const supabase = createClient();
      const [incRes, expRes, projRes, pledgeRes] = await Promise.all([
        supabase.from("tfam_finance_income").select("*").order("income_date", { ascending: false }),
        supabase.from("tfam_finance_expenses").select("*").order("expense_date", { ascending: false }),
        supabase.from("tfam_finance_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("tfam_finance_pledges").select("*").order("pledge_date", { ascending: false }),
      ]);
      setIncome(incRes.data || []);
      setExpenses(expRes.data || []);
      setProjects(projRes.data || []);
      setPledges(pledgeRes.data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  // ── INCOME ACTIONS ──
  const submitIncome = async (e: FormEvent) => {
    e.preventDefault();
    if (!incomeForm.amount || Number(incomeForm.amount) <= 0) { toast.error("Enter valid amount"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_income").insert({
        category: incomeForm.category,
        amount: Number(incomeForm.amount),
        description: incomeForm.description.trim() || null,
        received_by: incomeForm.received_by.trim() || null,
        income_date: incomeForm.income_date,
      });
      toast.success("✅ Income recorded!");
      setIncomeForm({ category: "Tithe", amount: "", description: "", received_by: "", income_date: getLocalToday() });
      setShowIncomeForm(false);
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteIncome = async (id: string) => {
    if (!confirm("Delete this income record?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_income").delete().eq("id", id);
      setIncome((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  // ── EXPENSE ACTIONS ──
  const submitExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) { toast.error("Enter valid amount"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_expenses").insert({
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        description: expenseForm.description.trim() || null,
        paid_to: expenseForm.paid_to.trim() || null,
        expense_date: expenseForm.expense_date,
      });
      toast.success("✅ Expense recorded!");
      setExpenseForm({ category: "Utility Bills", amount: "", description: "", paid_to: "", expense_date: getLocalToday() });
      setShowExpenseForm(false);
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_expenses").delete().eq("id", id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  // ── PROJECT ACTIONS ──
  const submitProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) { toast.error("Enter project name"); return; }
    if (!projectForm.target_amount || Number(projectForm.target_amount) <= 0) { toast.error("Enter target amount"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_projects").insert({
        name: projectForm.name.trim(),
        description: projectForm.description.trim() || null,
        target_amount: Number(projectForm.target_amount),
        raised_amount: 0,
        status: "active",
        start_date: projectForm.start_date || null,
        target_date: projectForm.target_date || null,
      });
      toast.success("✅ Project created!");
      setProjectForm({ name: "", description: "", target_amount: "", start_date: getLocalToday(), target_date: "" });
      setShowProjectForm(false);
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const updateProjectRaised = async (id: string, newAmount: number) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_projects").update({
        raised_amount: newAmount,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, raised_amount: newAmount } : p));
      toast.success("Updated!");
    } catch { toast.error("Failed"); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_projects").delete().eq("id", id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  // ── PLEDGE ACTIONS ──
  const submitPledge = async (e: FormEvent) => {
    e.preventDefault();
    if (!pledgeForm.member_name.trim()) { toast.error("Enter member name"); return; }
    if (!pledgeForm.pledge_amount || Number(pledgeForm.pledge_amount) <= 0) { toast.error("Enter pledge amount"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const paidAmt = Number(pledgeForm.paid_amount) || 0;
      const pledgeAmt = Number(pledgeForm.pledge_amount);
      const status = paidAmt >= pledgeAmt ? "fulfilled" : paidAmt > 0 ? "partial" : "pending";
      await supabase.from("tfam_finance_pledges").insert({
        member_name: pledgeForm.member_name.trim(),
        member_id: pledgeForm.member_id.trim() || null,
        pledge_amount: pledgeAmt,
        paid_amount: paidAmt,
        purpose: pledgeForm.purpose.trim() || null,
        pledge_date: pledgeForm.pledge_date,
        due_date: pledgeForm.due_date || null,
        notes: pledgeForm.notes.trim() || null,
        status,
      });
      toast.success("✅ Pledge recorded!");
      setPledgeForm({ member_name: "", member_id: "", pledge_amount: "", paid_amount: "0", purpose: "", pledge_date: getLocalToday(), due_date: "", notes: "" });
      setShowPledgeForm(false);
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deletePledge = async (id: string) => {
    if (!confirm("Delete this pledge?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_finance_pledges").delete().eq("id", id);
      setPledges((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  // ── COMPUTED STATS ──
  const totalIncome = income.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const totalPledged = pledges.reduce((s, p) => s + Number(p.pledge_amount), 0);
  const totalPledgePaid = pledges.reduce((s, p) => s + Number(p.paid_amount), 0);

  // This month
  const now = new Date();
  const thisMonthIncome = income.filter((i) => {
    const d = new Date(i.income_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, i) => s + Number(i.amount), 0);

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.expense_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + Number(e.amount), 0);

  const TABS = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "income", label: "💰 Income" },
    { id: "expenses", label: "📉 Expenses" },
    { id: "projects", label: "🏗️ Projects" },
    { id: "pledges", label: "💳 Pledges" },
  ];

  if (loading) return <LoadingScreen message="Loading finance data..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Church Finance</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Church Finance
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Track income, expenses, projects and pledges.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-lg">{formatAmount(totalIncome)}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total Income</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg">{formatAmount(totalExpenses)}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className={`font-black text-lg ${netBalance >= 0 ? "text-green-300" : "text-red-300"}`}>
                {formatAmount(netBalance)}
              </p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Net Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── DASHBOARD TAB ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">

          {/* This Month Summary */}
          <h2 className="text-white font-heading font-bold text-base">📅 This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "Income", value: formatAmount(thisMonthIncome), color: "border-green-400/40" },
              { label: "Expenses", value: formatAmount(thisMonthExpenses), color: "border-red-400/40" },
              { label: "Net", value: formatAmount(thisMonthIncome - thisMonthExpenses), color: (thisMonthIncome - thisMonthExpenses) >= 0 ? "border-green-400/40" : "border-red-400/40" },
            ].map((s) => (
              <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.color} p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                <p className="text-white font-black text-2xl">{s.value}</p>
              </div>
            ))}
          </div>

          {/* All Time Summary */}
          <h2 className="text-white font-heading font-bold text-base">📊 All Time</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Income", value: formatAmount(totalIncome) },
              { label: "Total Expenses", value: formatAmount(totalExpenses) },
              { label: "Net Balance", value: formatAmount(netBalance) },
              { label: "Total Pledges", value: formatAmount(totalPledged) },
            ].map((s) => (
              <div key={s.label} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                <p className="text-white font-black text-lg">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Income by Category */}
          <h2 className="text-white font-heading font-bold text-base">💰 Income by Category</h2>
          <div className="space-y-2">
            {INCOME_CATEGORIES.map((cat) => {
              const catTotal = income.filter((i) => i.category === cat).reduce((s, i) => s + Number(i.amount), 0);
              if (catTotal === 0) return null;
              const pct = totalIncome > 0 ? Math.round((catTotal / totalIncome) * 100) : 0;
              return (
                <div key={cat} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-black text-sm">{cat}</p>
                    <p className="text-white font-black text-sm">{formatAmount(catTotal)}</p>
                  </div>
                  <div className="bg-brand-purple-950/60 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-brand-purple-200 text-xs mt-1">{pct}% of total income</p>
                </div>
              );
            })}
          </div>

          {/* Projects Overview */}
          {projects.length > 0 && (
            <>
              <h2 className="text-white font-heading font-bold text-base">🏗️ Active Projects</h2>
              {projects.filter((p) => p.status === "active").map((p) => {
                const pct = p.target_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.target_amount) * 100)) : 0;
                return (
                  <div key={p.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-black text-base">{p.name}</p>
                      <p className="text-white font-black text-sm">{pct}%</p>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-xs text-brand-purple-200">
                      <span>Raised: {formatAmount(p.raised_amount)}</span>
                      <span>Target: {formatAmount(p.target_amount)}</span>
                    </div>
                    <div className="bg-brand-purple-950/60 rounded-full h-3">
                      <div className="h-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── INCOME TAB ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === "income" && (
        <div className="space-y-4">
          <button
            onClick={() => setShowIncomeForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Record Income
          </button>

          {income.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No income records yet</h3>
              <p className="text-brand-purple-200 text-sm">Start recording church income.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {income.map((item) => (
                <div key={item.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/40 p-5 shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                          {item.category}
                        </span>
                        <span className="text-brand-purple-200 text-xs">{formatDate(item.income_date)}</span>
                      </div>
                      <p className="text-white font-black text-xl">{formatAmount(Number(item.amount))}</p>
                      {item.description && <p className="text-white font-semibold text-sm mt-1">{item.description}</p>}
                      {item.received_by && <p className="text-brand-purple-200 text-xs">👤 Received by: {item.received_by}</p>}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => deleteIncome(item.id)}
                      className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── EXPENSES TAB ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          <button
            onClick={() => setShowExpenseForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Record Expense
          </button>

          {expenses.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">📉</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No expense records yet</h3>
              <p className="text-brand-purple-200 text-sm">Start recording church expenses.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((item) => (
                <div key={item.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/40 p-5 shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-400/40">
                          {item.category}
                        </span>
                        <span className="text-brand-purple-200 text-xs">{formatDate(item.expense_date)}</span>
                      </div>
                      <p className="text-white font-black text-xl">{formatAmount(Number(item.amount))}</p>
                      {item.description && <p className="text-white font-semibold text-sm mt-1">{item.description}</p>}
                      {item.paid_to && <p className="text-brand-purple-200 text-xs">👤 Paid to: {item.paid_to}</p>}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => deleteExpense(item.id)}
                      className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── PROJECTS TAB ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <button
            onClick={() => setShowProjectForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Create Project Fund
          </button>

          {projects.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-brand-purple-200 text-sm">Create your first project fund.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => {
                const pct = p.target_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.target_amount) * 100)) : 0;
                return (
                  <div key={p.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                        p.status === "completed" ? "bg-green-500/20 text-green-300 border-green-400/40" : "bg-blue-500/20 text-blue-300 border-blue-400/40"
                      }`}>
                        {p.status === "completed" ? "✅ Completed" : "🏗️ Active"}
                      </span>
                    </div>

                    <p className="font-black text-white text-base mb-1">{p.name}</p>
                    {p.description && <p className="text-white font-semibold text-sm mb-3">{p.description}</p>}

                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-brand-purple-200">Raised: <span className="text-white font-black">{formatAmount(p.raised_amount)}</span></span>
                      <span className="text-white font-black">{pct}%</span>
                    </div>
                    <div className="bg-brand-purple-950/60 rounded-full h-3 mb-1">
                      <div className="h-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-brand-purple-200 text-xs mb-3">
                      Target: {formatAmount(p.target_amount)}
                      {p.target_date && ` • Due: ${formatDate(p.target_date)}`}
                    </p>

                    {/* Update raised amount */}
                    <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30 mb-3">
                      <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-2">Update Raised Amount</p>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          defaultValue={p.raised_amount}
                          id={`raised-${p.id}`}
                          className="flex-1 p-2 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/80 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-sm"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`raised-${p.id}`) as HTMLInputElement;
                            updateProjectRaised(p.id, Number(input.value));
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-xs shadow-gold"
                        >
                          Update
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteProject(p.id)}
                      className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete Project
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── PLEDGES TAB ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === "pledges" && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Total Pledged</p>
              <p className="text-white font-black text-lg">{formatAmount(totalPledged)}</p>
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/40 p-4 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
              <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Total Paid</p>
              <p className="text-white font-black text-lg">{formatAmount(totalPledgePaid)}</p>
            </div>
          </div>

          <button
            onClick={() => setShowPledgeForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Record Pledge
          </button>

          {pledges.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No pledges yet</h3>
              <p className="text-brand-purple-200 text-sm">Record member pledges here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pledges.map((p) => {
                const pct = p.pledge_amount > 0 ? Math.min(100, Math.round((p.paid_amount / p.pledge_amount) * 100)) : 0;
                return (
                  <div key={p.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                    p.status === "fulfilled" ? "border-green-400/40" :
                    p.status === "partial" ? "border-blue-400/40" :
                    "border-brand-gold-400/40"
                  } p-5 shadow-xl`}>
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                        p.status === "fulfilled" ? "bg-green-500/20 text-green-300 border-green-400/40" :
                        p.status === "partial" ? "bg-blue-500/20 text-blue-300 border-blue-400/40" :
                        "bg-brand-purple-950/60 text-white border-brand-gold-400/40"
                      }`}>
                        {p.status === "fulfilled" ? "✅ Fulfilled" : p.status === "partial" ? "🔄 Partial" : "⏳ Pending"}
                      </span>
                      <span className="text-brand-purple-200 text-xs">{formatDate(p.pledge_date)}</span>
                    </div>

                    <p className="font-black text-white text-base">{p.member_name}</p>
                    {p.member_id && <p className="text-brand-purple-200 text-xs">{p.member_id}</p>}
                    {p.purpose && <p className="text-white font-semibold text-sm mt-1">📌 {p.purpose}</p>}

                    <div className="flex items-center justify-between my-2 text-sm">
                      <span className="text-brand-purple-200">Paid: <span className="text-white font-black">{formatAmount(p.paid_amount)}</span></span>
                      <span className="text-brand-purple-200">Pledged: <span className="text-white font-black">{formatAmount(p.pledge_amount)}</span></span>
                    </div>
                    <div className="bg-brand-purple-950/60 rounded-full h-2 mb-3">
                      <div className="h-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    {p.due_date && <p className="text-brand-purple-200 text-xs mb-2">⏰ Due: {formatDate(p.due_date)}</p>}
                    {p.notes && <p className="text-white font-semibold text-xs mb-3">📝 {p.notes}</p>}

                    <button
                      onClick={() => deletePledge(p.id)}
                      className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete Pledge
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ── INCOME FORM MODAL ── */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showIncomeForm && (
        <>
          <div onClick={() => setShowIncomeForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">💰 Record Income</h2>
                  <button onClick={() => setShowIncomeForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={submitIncome} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={incomeForm.category} onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900">
                    {INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₦) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                    placeholder="e.g. 50000" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <input type="text" value={incomeForm.description} onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                    placeholder="Optional description" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Received By</label>
                  <input type="text" value={incomeForm.received_by} onChange={(e) => setIncomeForm({ ...incomeForm, received_by: e.target.value })}
                    placeholder="Name of receiver" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" value={incomeForm.income_date} onChange={(e) => setIncomeForm({ ...incomeForm, income_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "💰 Save Income"}
                  </button>
                  <button type="button" onClick={() => setShowIncomeForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── EXPENSE FORM MODAL ── */}
      {showExpenseForm && (
        <>
          <div onClick={() => setShowExpenseForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">📉 Record Expense</h2>
                  <button onClick={() => setShowExpenseForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={submitExpense} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900">
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₦) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="e.g. 20000" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <input type="text" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    placeholder="What was purchased or paid for" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Paid To</label>
                  <input type="text" value={expenseForm.paid_to} onChange={(e) => setExpenseForm({ ...expenseForm, paid_to: e.target.value })}
                    placeholder="Name or company paid" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "📉 Save Expense"}
                  </button>
                  <button type="button" onClick={() => setShowExpenseForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── PROJECT FORM MODAL ── */}
      {showProjectForm && (
        <>
          <div onClick={() => setShowProjectForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">🏗️ Create Project Fund</h2>
                  <button onClick={() => setShowProjectForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={submitProject} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Project Name <span className="text-red-500">*</span></label>
                  <input type="text" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="e.g. Church Building Fund" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={3} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount (₦) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={projectForm.target_amount} onChange={(e) => setProjectForm({ ...projectForm, target_amount: e.target.value })}
                    placeholder="e.g. 5000000" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input type="date" value={projectForm.start_date} onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Completion Date</label>
                  <input type="date" value={projectForm.target_date} onChange={(e) => setProjectForm({ ...projectForm, target_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "🏗️ Create Project"}
                  </button>
                  <button type="button" onClick={() => setShowProjectForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── PLEDGE FORM MODAL ── */}
      {showPledgeForm && (
        <>
          <div onClick={() => setShowPledgeForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">💳 Record Pledge</h2>
                  <button onClick={() => setShowPledgeForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={submitPledge} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Member Name <span className="text-red-500">*</span></label>
                  <input type="text" value={pledgeForm.member_name} onChange={(e) => setPledgeForm({ ...pledgeForm, member_name: e.target.value })}
                    placeholder="Full name" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Member ID (Optional)</label>
                  <input type="text" value={pledgeForm.member_id} onChange={(e) => setPledgeForm({ ...pledgeForm, member_id: e.target.value })}
                    placeholder="e.g. TFAM2026-0001" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pledge Amount (₦) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={pledgeForm.pledge_amount} onChange={(e) => setPledgeForm({ ...pledgeForm, pledge_amount: e.target.value })}
                    placeholder="e.g. 100000" required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount Paid So Far (₦)</label>
                  <input type="number" min="0" value={pledgeForm.paid_amount} onChange={(e) => setPledgeForm({ ...pledgeForm, paid_amount: e.target.value })}
                    placeholder="0" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Purpose</label>
                  <input type="text" value={pledgeForm.purpose} onChange={(e) => setPledgeForm({ ...pledgeForm, purpose: e.target.value })}
                    placeholder="e.g. Building Fund" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pledge Date</label>
                  <input type="date" value={pledgeForm.pledge_date} onChange={(e) => setPledgeForm({ ...pledgeForm, pledge_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date (Optional)</label>
                  <input type="date" value={pledgeForm.due_date} onChange={(e) => setPledgeForm({ ...pledgeForm, due_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                  <textarea value={pledgeForm.notes} onChange={(e) => setPledgeForm({ ...pledgeForm, notes: e.target.value })}
                    rows={2} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "💳 Save Pledge"}
                  </button>
                  <button type="button" onClick={() => setShowPledgeForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

    </div>
  );
}