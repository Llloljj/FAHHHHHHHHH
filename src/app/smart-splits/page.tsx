'use client'

import { useState } from 'react'
import { RevealUp } from '@/components/reveal-up'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Receipt, 
  Plus, 
  Trash2, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft,
  History,
  TrendingUp,
  PieChart,
  ArrowLeft
} from 'lucide-react'

// Mock data for the demo
const INITIAL_MEMBERS = [
  { id: 'm1', user_id: 'user-you', role: 'admin' },
  { id: 'm2', user_id: 'user-alex', role: 'member' },
  { id: 'm3', user_id: 'user-sam', role: 'member' },
]

const INITIAL_EXPENSES = [
  {
    id: 'e1',
    description: 'Luxury Resort Stay',
    amount: 15000,
    payer_id: 'user-you',
    date: '2026-05-01',
  },
  {
    id: 'e2',
    description: 'Fine Dining Dinner',
    amount: 4500,
    payer_id: 'user-alex',
    date: '2026-05-02',
  },
  {
    id: 'e3',
    description: 'Local Tour Guide & Entry Fees',
    amount: 3000,
    payer_id: 'user-sam',
    date: '2026-05-03',
  },
]

const INITIAL_SETTLEMENTS: any[] = []

export default function SmartSplitsDemoPage() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [settlements, setSettlements] = useState(INITIAL_SETTLEMENTS)
  const members = INITIAL_MEMBERS
  const currentUserId = 'user-you'

  // Calculate balances (Same logic as real component)
  const balances: Record<string, number> = {}
  members.forEach(m => balances[m.user_id] = 0)

  expenses.forEach(exp => {
    const totalAmount = exp.amount
    const share = totalAmount / members.length
    
    balances[exp.payer_id] += (totalAmount - share)

    members.forEach(m => {
      if (m.user_id !== exp.payer_id) {
        balances[m.user_id] -= share
      }
    })
  })

  // Adjust for settlements
  settlements.forEach(s => {
    balances[s.payer_id] += s.amount
    balances[s.receiver_id] -= s.amount
  })

  const currentUserBalance = balances[currentUserId] || 0

  // Suggested settlements algorithm (Simplified greedy algorithm)
  const debtors: [string, number][] = []
  const creditors: [string, number][] = []

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance < -0.01) debtors.push([userId, balance])
    if (balance > 0.01) creditors.push([userId, balance])
  })

  debtors.sort((a, b) => a[1] - b[1])
  creditors.sort((a, b) => b[1] - a[1])

  const suggestedSettlements: any[] = []
  let dIdx = 0
  let cIdx = 0

  let dList = debtors.map(d => [...d] as [string, number])
  let cList = creditors.map(c => [...c] as [string, number])

  while (dIdx < dList.length && cIdx < cList.length) {
    const debtor = dList[dIdx]
    const creditor = cList[cIdx]
    const amount = Math.min(Math.abs(debtor[1]), creditor[1])

    suggestedSettlements.push({
      from: debtor[0],
      to: creditor[0],
      amount
    })

    debtor[1] += amount
    creditor[1] -= amount

    if (Math.abs(debtor[1]) < 0.01) dIdx++
    if (Math.abs(creditor[1]) < 0.01) cIdx++
  }

  // Interactive Handlers (Local state instead of DB)
  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)

    if (!description || isNaN(amount)) return

    const newExpense = {
      id: `e-${Date.now()}`,
      description,
      amount,
      payer_id: currentUserId, // Demo assumes "You" are paying
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([newExpense, ...expenses])
    e.currentTarget.reset()
  }

  const handleSettle = (fromId: string, toId: string, amount: number) => {
    const newSettlement = {
      id: `s-${Date.now()}`,
      payer_id: fromId,
      receiver_id: toId,
      amount,
      date: new Date().toISOString().split('T')[0]
    }
    setSettlements([...settlements, newSettlement])
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(exp => exp.id !== expenseId))
  }

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <RevealUp>
          <div className="mb-12">
            <Link href="/" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-8 inline-block flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> Back to Home
            </Link>
            <div className="flex items-center gap-4 text-[#3B9ECC] mb-4">
              <PieChart className="w-8 h-8" />
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">Feature Demo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#262626] mb-4">
              Smart Splits
            </h1>
            <p className="text-xl text-[#262626]/60 font-medium max-w-3xl leading-relaxed">
              This is a live demo. Try adding expenses or settling debts below to see the algorithm calculate balances in real-time!
            </p>
          </div>
        </RevealUp>

        {/* Live Demo Component */}
        <RevealUp delay={300}>
          <div className="bg-[#f5f0eb] p-8 rounded-[32px] shadow-xl shadow-[#262626]/5 border border-[#262626]/5 space-y-8">
            
            {/* Balance Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#262626] text-white border-0 rounded-[24px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp className="w-24 h-24" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Your Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black tracking-tighter">
                      ₹{Math.abs(currentUserBalance).toFixed(0)}
                    </span>
                    <span className={`text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-1 ${currentUserBalance >= 0 ? 'text-[#3B9ECC]' : 'text-red-400'}`}>
                      {currentUserBalance >= 0 ? (
                        <><ArrowUpRight className="w-4 h-4" /> You are owed</>
                      ) : (
                        <><ArrowDownLeft className="w-4 h-4" /> You owe</>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#262626]/10 shadow-sm rounded-[24px] bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">Quick Add Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddExpense} className="flex gap-3">
                    <div className="relative flex-1">
                      <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/30" />
                      <Input 
                        name="description" 
                        placeholder="Dinner, Taxi, etc." 
                        required
                        className="rounded-full pl-11 bg-[#f5f0eb] border-0"
                      />
                    </div>
                    <div className="relative w-32">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/30" />
                      <Input 
                        name="amount" 
                        type="number" 
                        placeholder="Amount" 
                        required
                        className="rounded-full pl-11 bg-[#f5f0eb] border-0"
                      />
                    </div>
                    <Button type="submit" className="rounded-full bg-[#3B9ECC] hover:opacity-80 text-[#262626]">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Settlements View */}
            {suggestedSettlements.length > 0 && (
              <Card className="border-[#262626]/5 bg-[#fdf8f3] rounded-[24px]">
                <CardHeader>
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">Suggested Settlements</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedSettlements.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#262626]/5 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-[#262626]/40 mb-1">
                          {s.from === currentUserId ? 'YOU OWE' : 'ALEX OWES'}
                        </span>
                        <span className="text-sm font-black text-[#262626] uppercase">
                          {s.to === currentUserId ? 'YOU' : 'SAM'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-[#3B9ECC]">₹{s.amount.toFixed(0)}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSettle(s.from, s.to, s.amount)}
                          className="h-6 text-[8px] font-black uppercase tracking-widest text-[#262626]/40 hover:text-[#3B9ECC]"
                        >
                          Settle
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Expense History */}
            <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden bg-white">
              <CardHeader className="bg-[#f5f0eb]/50 p-6 border-b border-[#262626]/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <History className="w-5 h-5 text-[#3B9ECC]" />
                  Expense Ledger
                </CardTitle>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">
                  Total Spend: ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(0)}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#262626]/5">
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Date</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Description</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Payer</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 text-right">Amount</th>
                        <th className="p-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="border-b border-[#262626]/5 hover:bg-[#f5f0eb]/30 transition-colors group">
                          <td className="p-6 text-sm font-bold text-[#262626]/60">
                            {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="p-6 text-sm font-black text-[#262626] uppercase tracking-tight">
                            {exp.description}
                          </td>
                          <td className="p-6 text-sm font-bold text-[#262626]/60">
                            {exp.payer_id === currentUserId ? 'You' : exp.payer_id === 'user-alex' ? 'Alex' : 'Sam'}
                          </td>
                          <td className="p-6 text-sm font-black text-[#262626] text-right">
                            ₹{exp.amount.toFixed(0)}
                          </td>
                          <td className="p-6 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>
        </RevealUp>

      </div>
    </div>
  )
}
