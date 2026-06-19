import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft, ArrowUpRight,
  CreditCard, Building, Phone, ChevronRight,
  TrendingUp, TrendingDown, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UserRole } from '../../core/types';
const transactions = [
  { id: 't1', type: 'credit', desc: 'Deposit via Card', amount: 5000, time: '2h ago', status: 'success' },
  { id: 't2', type: 'debit', desc: 'GoldTips VIP Subscription', amount: 2500, time: '1d ago', status: 'success' },
  { id: 't3', type: 'credit', desc: 'Referral Bonus', amount: 1000, time: '2d ago', status: 'success' },
  { id: 't4', type: 'debit', desc: 'Champions Elite Subscription', amount: 3500, time: '3d ago', status: 'success' },
  { id: 't5', type: 'credit', desc: 'Deposit via Bank Transfer', amount: 10000, time: '5d ago', status: 'success' },
  { id: 't6', type: 'debit', desc: 'Withdrawal to Bank', amount: 8000, time: '1w ago', status: 'success' },
  { id: 't7', type: 'credit', desc: 'Channel Subscription Revenue', amount: 25000, time: '1w ago', status: 'success' },
  { id: 't8', type: 'debit', desc: 'LaLiga Insider Subscription', amount: 1500, time: '2w ago', status: 'pending' },
];
const paymentMethods = [
  { id: 'pm1', icon: CreditCard, label: 'Debit/Credit Card', desc: 'Visa, Mastercard, Verve' },
  { id: 'pm2', icon: Building, label: 'Bank Transfer', desc: 'Direct bank deposit' },
  { id: 'pm3', icon: Phone, label: 'USSD', desc: '*737#, *919# and more' },
];
interface WalletPageProps {
  userRole: UserRole;
}
export function WalletPage({ userRole }: WalletPageProps) {
  const isTipster = userRole === 'tipster';
  const balance = 4500;
  const earnings = 31000000;
  const quickAmounts = [1000, 2000, 5000, 10000];
  const baseTabs = [
    { key: 'overview', label: ' Overview' },
    { key: 'deposit',  label: ' Deposit' },
    { key: 'withdraw', label: ' Withdraw' },
    { key: 'history',  label: ' History' },
  ];
  const tipsterTabs = [
    ...baseTabs,
    { key: 'earnings', label: ' Earnings' },
  ];
  const tabs = isTipster ? tipsterTabs : baseTabs;
  const [activeTab, setActiveTab] = useState('overview');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="px-4 py-3">
          <h1 className="text-lg font-black text-white mb-3">Wallet</h1>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0',
                  activeTab === tab.key ? 'bg-[#ef4444] text-white' : 'text-[#71767b] hover:text-white hover:bg-white/5'
                )}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] rounded-2xl p-6 text-white">
                <p className="text-sm opacity-80 mb-1">Available Balance</p>
                <p className="text-4xl font-black mb-4">₦{balance.toLocaleString()}</p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab('deposit')} className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-bold transition-all">
                    <ArrowDownLeft className="w-4 h-4" /> Deposit
                  </button>
                  <button onClick={() => setActiveTab('withdraw')} className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl py-2.5 text-sm font-bold transition-all">
                    <ArrowUpRight className="w-4 h-4" /> Withdraw
                  </button>
                </div>
              </div>
              {isTipster && (
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4">
                  <p className="text-xs text-yellow-400 font-bold mb-1"> Tipster Earnings</p>
                  <p className="text-2xl font-black text-white">₦{earnings.toLocaleString()}</p>
                  <p className="text-xs text-[#71767b] mt-1">Total channel revenue</p>
                  <button onClick={() => setActiveTab('earnings')} className="mt-2 text-xs text-yellow-400 font-bold hover:underline">View earnings</button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><p className="text-xs text-[#71767b]">Total In</p></div>
                  <p className="text-xl font-black text-white">₦19,000</p>
                  <p className="text-xs text-green-400 mt-0.5">This month</p>
                </div>
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-[#ef4444]" /><p className="text-xs text-[#71767b]">Total Out</p></div>
                  <p className="text-xl font-black text-white">₦15,500</p>
                  <p className="text-xs text-[#ef4444] mt-0.5">This month</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-white text-sm">Recent Transactions</p>
                  <button onClick={() => setActiveTab('history')} className="text-xs text-[#ef4444] hover:underline">See all</button>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 4).map((tx, i) => (
                    <motion.div key={tx.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-[#111] border border-[#1f1f1f] rounded-xl px-3 py-2.5"
                    >
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', tx.type === 'credit' ? 'bg-green-500/20' : 'bg-[#ef4444]/20')}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-[#ef4444]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-semibold truncate">{tx.desc}</p>
                        <p className="text-xs text-[#71767b]">{tx.time}</p>
                      </div>
                      <p className={cn('text-sm font-black shrink-0', tx.type === 'credit' ? 'text-green-400' : 'text-[#ef4444]')}>
                        {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Deposit */}
          {activeTab === 'deposit' && (
            <div className="p-4 space-y-4">
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                <p className="text-xs text-[#71767b] mb-1">Current Balance</p>
                <p className="text-2xl font-black text-white">₦{balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2">Enter Amount</p>
                <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-4 py-3 transition-all mb-3">
                  <span className="text-[#71767b] font-bold">₦</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                    className="flex-1 bg-transparent text-xl font-black text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(a => (
                    <button key={a} onClick={() => setAmount(String(a))}
                      className={cn('py-2 rounded-xl text-xs font-bold border transition-all', amount === String(a) ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]' : 'bg-[#111] border-[#1f1f1f] text-[#71767b] hover:border-white/20 hover:text-white')}
                    >₦{a.toLocaleString()}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2">Payment Method</p>
                <div className="space-y-2">
                  {paymentMethods.map(pm => {
                    const Icon = pm.icon;
                    return (
                      <button key={pm.id} onClick={() => setSelectedMethod(pm.id)}
                        className={cn('w-full flex items-center gap-3 p-3 rounded-xl border transition-all', selectedMethod === pm.id ? 'bg-[#ef4444]/10 border-[#ef4444]/30' : 'bg-[#111] border-[#1f1f1f] hover:border-white/10')}
                      >
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', selectedMethod === pm.id ? 'bg-[#ef4444]/20' : 'bg-white/5')}>
                          <Icon className={cn('w-4 h-4', selectedMethod === pm.id ? 'text-[#ef4444]' : 'text-[#71767b]')} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-white">{pm.label}</p>
                          <p className="text-xs text-[#71767b]">{pm.desc}</p>
                        </div>
                        <ChevronRight className={cn('w-4 h-4', selectedMethod === pm.id ? 'text-[#ef4444]' : 'text-[#71767b]')} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <button disabled={!amount || !selectedMethod}
                className="w-full py-3 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full text-sm font-bold text-white hover:opacity-90 transition-all disabled:opacity-40"
              >Deposit ₦{amount ? Number(amount).toLocaleString() : '0'}</button>
            </div>
          )}
          {/* Withdraw */}
          {activeTab === 'withdraw' && (
            <div className="p-4 space-y-4">
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                <p className="text-xs text-[#71767b] mb-1">Available to Withdraw</p>
                <p className="text-2xl font-black text-white">₦{balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2">Withdraw Amount</p>
                <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] focus-within:border-[#ef4444]/50 rounded-xl px-4 py-3 transition-all mb-3">
                  <span className="text-[#71767b] font-bold">₦</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                    className="flex-1 bg-transparent text-xl font-black text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(a => (
                    <button key={a} onClick={() => setAmount(String(a))}
                      className={cn('py-2 rounded-xl text-xs font-bold border transition-all', amount === String(a) ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]' : 'bg-[#111] border-[#1f1f1f] text-[#71767b] hover:border-white/20 hover:text-white')}
                    >₦{a.toLocaleString()}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-2">Bank Details</p>
                <div className="space-y-3">
                  <input placeholder="Account Number" className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#71767b] outline-none transition-all" />
                  <input placeholder="Bank Name" className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#71767b] outline-none transition-all" />
                  <input placeholder="Account Name" className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#71767b] outline-none transition-all" />
                </div>
              </div>
              <button disabled={!amount} className="w-full py-3 bg-gradient-to-r from-[#dc2626] to-[#ef4444] rounded-full text-sm font-bold text-white hover:opacity-90 transition-all disabled:opacity-40">
                Withdraw ₦{amount ? Number(amount).toLocaleString() : '0'}
              </button>
              <p className="text-xs text-[#71767b] text-center">Withdrawals are processed within 24 hours</p>
            </div>
          )}
          {/* History */}
          {activeTab === 'history' && (
            <div>
              <div className="px-4 py-3 border-b border-[#1f1f1f]">
                <p className="font-black text-white text-sm">Transaction History</p>
                <p className="text-xs text-[#71767b] mt-0.5">{transactions.length} transactions</p>
              </div>
              {transactions.map((tx, i) => (
                <motion.div key={tx.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors"
                >
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', tx.type === 'credit' ? 'bg-green-500/20' : 'bg-[#ef4444]/20')}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-[#ef4444]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold truncate">{tx.desc}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-[#71767b]">{tx.time}</p>
                      {tx.status === 'pending' && (
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold">
                          <Clock className="w-2.5 h-2.5" /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={cn('text-sm font-black shrink-0', tx.type === 'credit' ? 'text-green-400' : 'text-[#ef4444]')}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
          {/* Earnings — tipster only */}
          {activeTab === 'earnings' && isTipster && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Total Earnings This Month</p>
                <p className="text-3xl font-black mb-1">₦5,000,000</p>
                <p className="text-xs text-yellow-400">+12% from last month</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <p className="text-xs text-[#71767b] mb-1">This Month</p>
                  <p className="text-xl font-black text-white">₦5,000,000</p>
                  <p className="text-xs text-green-400 mt-0.5">+12%</p>
                </div>
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  <p className="text-xs text-[#71767b] mb-1">All Time</p>
                  <p className="text-xl font-black text-white">₦31,000,000</p>
                  <p className="text-xs text-[#71767b] mt-0.5">Since Jan 2024</p>
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-3">Payout History</p>
                <div className="space-y-2">
                  {[
                    { amount: '₦5,000,000', date: 'Apr 1, 2026' },
                    { amount: '₦4,200,000', date: 'Mar 1, 2026' },
                    { amount: '₦3,800,000', date: 'Feb 1, 2026' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#111] border border-[#1f1f1f] rounded-xl px-3 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{p.amount}</p>
                        <p className="text-xs text-[#71767b]">{p.date}</p>
                      </div>
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">PAID</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
