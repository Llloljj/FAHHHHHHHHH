'use client'

import { useState } from 'react'
import { addExpense, deleteExpense, settleDebt } from '@/app/actions/expense-actions'
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
  TrendingUp
} from 'lucide-react'

interface ExpenseLedgerProps {
  tripId: string
  expenses: any[]
  settlements: any[]
  members: any[]
  currentUserId?: string
}

export function ExpenseLedger({ tripId, expenses, settlements, members, currentUserId }: ExpenseLedgerProps) {
  const [loading, setLoading] = useState(false)

  // Calculate balances
  const balances: Record<string, number> = {}
  members.forEach(m => balances[m.user_id] = 0)

  expenses.forEach(exp => {
    // Payer is "owed" the full amount minus their own share
    const totalAmount = exp.amount
    const share = totalAmount / members.length
    
    balances[exp.payer_id] += (totalAmount - share)

    // Everyone else "owes" their share
    members.forEach(m => {
      if (m.user_id !== exp.payer_id) {
        balances[m.user_id] -= share
      }
    })
  })

  // Adjust balances based on settlements
  settlements.forEach(s => {
    balances[s.from_id] += s.amount
    balances[s.to_id] -= s.amount
  })

  const currentUserBalance = currentUserId ? balances[currentUserId] || 0 : 0

  // Settlement Engine: Calculate who owes whom
  const suggestedSettlements: { from: string, to: string, amount: number }[] = []
  const debtors = Object.entries(balances)
    .filter(([_, bal]) => bal < -0.01)
    .sort((a, b) => a[1] - b[1]) // Most negative first
  const creditors = Object.entries(balances)
    .filter(([_, bal]) => bal > 0.01)
    .sort((a, b) => b[1] - a[1]) // Most positive first

  let dIdx = 0
  let cIdx = 0
  const dList = [...debtors]
  const cList = [...creditors]

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

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('trip_id', tripId)
    try {
      await addExpense(formData)
      e.currentTarget.reset()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSettle = async (fromId: string, toId: string, amount: number) => {
    setLoading(true)
    try {
      await settleDebt(tripId, fromId, toId, amount)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards]">
      
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
              <span className={`text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-1 ${currentUserBalance >= 0 ? 'accent-gradient-text' : 'text-red-400'}`}>
                {currentUserBalance >= 0 ? (
                  <><ArrowUpRight className="w-4 h-4" /> You are owed</>
                ) : (
                  <><ArrowDownLeft className="w-4 h-4" /> You owe</>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#262626]/10 shadow-sm rounded-[24px]">
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
              <Button type="submit" disabled={loading} className="rounded-full accent-gradient hover:opacity-80 text-[#262626]">
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
                    {s.from === currentUserId ? 'YOU OWE' : `User ${s.from.substring(0,4)} OWES`}
                  </span>
                  <span className="text-sm font-black text-[#262626] uppercase">
                    {s.to === currentUserId ? 'YOU' : `User ${s.to.substring(0,4)}`}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black accent-gradient-text">₹{s.amount.toFixed(0)}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={loading}
                    onClick={() => handleSettle(s.from, s.to, s.amount)}
                    className="h-6 text-[8px] font-black uppercase tracking-widest text-[#262626]/40 hover:accent-gradient-text"
                  >
                    {loading ? '...' : 'Settle'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Expense History */}
      <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden">
        <CardHeader className="bg-[#f5f0eb]/50 p-6 border-b border-[#262626]/5 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
            <History className="w-5 h-5 accent-gradient-text" />
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
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-[#262626]/40 font-medium">
                      No expenses recorded yet. Start tracking to see the split.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="border-b border-[#262626]/5 hover:bg-[#f5f0eb]/30 transition-colors group">
                      <td className="p-6 text-sm font-bold text-[#262626]/60">
                        {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-6 text-sm font-black text-[#262626] uppercase tracking-tight">
                        {exp.description}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full accent-gradient/20 flex items-center justify-center text-[8px] font-black accent-gradient-text">
                            {exp.payer_id === currentUserId ? 'YOU' : 'P'}
                          </div>
                          <span className="text-xs font-bold text-[#262626]/70 uppercase">
                            {exp.payer_id === currentUserId ? 'You Paid' : `User ${exp.payer_id.substring(0, 4)}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right font-black text-[#262626]">
                        ₹{exp.amount.toFixed(0)}
                      </td>
                      <td className="p-6 text-right">
                        {exp.payer_id === currentUserId && (
                          <button 
                            onClick={() => deleteExpense(exp.id, tripId)}
                            className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
