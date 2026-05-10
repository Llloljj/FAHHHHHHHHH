'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Receipt, 
  Wallet,
  Lock,
  EyeOff,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { RevealUp } from '@/components/reveal-up'

// --- Mock Data ---
const CURRENT_USER_ID = 'u1'

const MEMBERS = [
  { id: 'u1', name: 'You (Guest)' },
  { id: 'u2', name: 'Alice' },
  { id: 'u3', name: 'Bob' }
]

const BASE_COSTS = [
  { id: 'b1', name: 'Luxury Villa (4 nights)', amount: 120000, paidBy: 'u2' },
  { id: 'b2', name: 'Flights (Round trip)', amount: 45000, paidBy: 'u1' },
  { id: 'b3', name: 'Car Rental', amount: 15000, paidBy: 'u3' }
]

// Extra costs are items meant for a specific person, but potentially paid by someone else (or shared pool)
const EXTRA_COSTS = [
  { id: 'e1', forUser: 'u1', name: 'Spa Day', amount: 8000, paidBy: 'u2' },
  { id: 'e2', forUser: 'u1', name: 'Souvenirs', amount: 2500, paidBy: 'u1' }, // Paid by self
  { id: 'e3', forUser: 'u2', name: 'Extra Baggage', amount: 3000, paidBy: 'u2' },
  { id: 'e4', forUser: 'u3', name: 'Special Diet Meal', amount: 1500, paidBy: 'u2' }
]

export function SmartSplits() {
  const [isTripEnded, setIsTripEnded] = useState(false)

  // -- Calculations --
  const totalBaseCost = BASE_COSTS.reduce((acc, curr) => acc + curr.amount, 0)
  const baseCostPerPerson = totalBaseCost / MEMBERS.length

  const getMemberExtras = (userId: string) => EXTRA_COSTS.filter(e => e.forUser === userId)
  const getTotalExtra = (userId: string) => getMemberExtras(userId).reduce((acc, curr) => acc + curr.amount, 0)

  // Settlement Engine
  const calculateSettlements = () => {
    const balances: Record<string, number> = {}
    MEMBERS.forEach(m => balances[m.id] = 0)

    // Apply base costs
    BASE_COSTS.forEach(cost => {
      balances[cost.paidBy] += cost.amount
    })
    
    // Subtract total base share once per member
    MEMBERS.forEach(m => balances[m.id] -= baseCostPerPerson)

    // Apply extra costs
    EXTRA_COSTS.forEach(cost => {
      balances[cost.paidBy] += cost.amount
      balances[cost.forUser] -= cost.amount
    })

    const suggestedSettlements: { from: string, to: string, amount: number }[] = []
    const debtors = Object.entries(balances).filter(([_, bal]) => bal < -0.01).sort((a, b) => a[1] - b[1])
    const creditors = Object.entries(balances).filter(([_, bal]) => bal > 0.01).sort((a, b) => b[1] - a[1])

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

    return { balances, settlements: suggestedSettlements }
  }

  const { balances, settlements } = calculateSettlements()
  const currentUserBalance = balances[CURRENT_USER_ID]

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: Base Trip Costs */}
      <RevealUp>
        <Card className="border-0 shadow-2xl rounded-[32px] overflow-hidden bg-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Users className="w-64 h-64" />
          </div>
          <CardHeader className="bg-[#f4f9f7] border-b border-[#1a2e26]/5 pb-8 pt-10 px-8 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <CardTitle className="text-3xl font-black uppercase tracking-tighter text-[#1a2e26] flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-[#3B9ECC]" />
                  Base Trip Costs
                </CardTitle>
                <CardDescription className="text-[#1a2e26]/50 font-medium mt-2">
                  Shared equally among {MEMBERS.length} partners
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] mb-1">Total Base</div>
                <div className="text-5xl font-black text-[#1a2e26]">₹{totalBaseCost.toLocaleString('en-IN')}</div>
                <div className="text-sm font-bold text-[#1a2e26]/40 mt-1">₹{baseCostPerPerson.toLocaleString('en-IN')} per person</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:px-12 bg-white">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2e26]/40 mb-6">Shared Itinerary Items</h4>
            <div className="space-y-4">
              {BASE_COSTS.map(cost => (
                <div key={cost.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#f4f9f7]/50 border border-[#1a2e26]/5">
                  <span className="font-bold text-[#1a2e26] text-lg">{cost.name}</span>
                  <span className="font-black text-[#1a2e26]">₹{cost.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </RevealUp>

      {/* SECTION 2: Partner Extras */}
      <RevealUp delay={200}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1a2e26]">Personal Extras</h3>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2e26]/40 bg-[#f4f9f7] px-3 py-1 rounded-full">
            Privacy Enabled
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBERS.map(member => {
            const isMe = member.id === CURRENT_USER_ID
            const extras = getMemberExtras(member.id)
            const totalExtra = getTotalExtra(member.id)

            return (
              <Card key={member.id} className={`border border-[#1a2e26]/5 rounded-[24px] ${isMe ? 'bg-[#f4f9f7] shadow-lg border-[#3B9ECC]/20' : 'bg-white shadow-sm'}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight text-[#1a2e26]">
                        {member.name}
                      </CardTitle>
                      {isMe && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] bg-[#3B9ECC]/10 px-2 py-0.5 rounded">Your View</span>}
                    </div>
                    {!isMe && <Lock className="w-4 h-4 text-[#1a2e26]/20" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2e26]/40 mb-1">Total Extra</div>
                    <div className="text-3xl font-black text-[#1a2e26]">₹{totalExtra.toLocaleString('en-IN')}</div>
                  </div>

                  {/* Private Details */}
                  {isMe ? (
                    <div className="space-y-3 pt-4 border-t border-[#1a2e26]/10">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] flex items-center gap-1">
                        <Receipt className="w-3 h-3" /> Your Detailed List
                      </div>
                      {extras.length === 0 ? (
                        <p className="text-sm font-medium text-[#1a2e26]/40">No extra expenses.</p>
                      ) : (
                        extras.map(e => (
                          <div key={e.id} className="flex justify-between items-center text-sm">
                            <span className="font-bold text-[#1a2e26]/70">{e.name}</span>
                            <span className="font-black text-[#1a2e26]">₹{e.amount.toLocaleString('en-IN')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-[#1a2e26]/5 flex flex-col items-center justify-center py-6 text-[#1a2e26]/30">
                      <EyeOff className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Details Hidden<br/>For Privacy</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </RevealUp>

      {/* SECTION 3: End of Trip Toggle & Breakdown */}
      <RevealUp delay={400}>
        <div className="mt-16 flex justify-center">
          <Button 
            onClick={() => setIsTripEnded(!isTripEnded)}
            className={`rounded-full px-12 py-8 text-sm font-black uppercase tracking-[0.2em] transition-super hover:opacity-90 ${isTripEnded ? 'bg-[#1a2e26] text-white' : 'bg-[#3B9ECC] text-white shadow-xl'}`}
            style={!isTripEnded ? { background: 'linear-gradient(135deg, #3B9ECC 0%, #52B788 100%)' } : {}}
          >
            {isTripEnded ? 'Close Settlement' : 'End Trip & Settle Up'}
          </Button>
        </div>

        {isTripEnded && (
          <div className="mt-12 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <Card className="bg-[#1a2e26] text-white border-0 rounded-[32px] overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <TrendingUp className="w-64 h-64" />
              </div>
              <CardHeader className="border-b border-white/10 pb-8 pt-10 px-8 md:px-12">
                <CardTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[#52B788]" />
                  Final Settlement
                </CardTitle>
                <CardDescription className="text-white/50 font-medium mt-2">
                  Trip concluded. Here is your detailed breakdown and who to pay.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Your Breakdown */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] mb-6">Your Total Liability</h4>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                        <span className="font-bold text-white/80 text-lg">Your Base Share</span>
                        <span className="font-black">₹{baseCostPerPerson.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                        <span className="font-bold text-white/80 text-lg">Your Personal Extras</span>
                        <span className="font-black">₹{getTotalExtra(CURRENT_USER_ID).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-[#3B9ECC]/20 border border-[#3B9ECC]/30">
                        <span className="font-bold text-white text-xl">Total You Owe To Pot</span>
                        <span className="font-black text-xl text-[#3B9ECC]">₹{(baseCostPerPerson + getTotalExtra(CURRENT_USER_ID)).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Who to pay */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#52B788] mb-6">Action Required</h4>
                    
                    {currentUserBalance > 0 ? (
                      <div className="p-8 rounded-3xl bg-[#52B788]/20 border border-[#52B788]/30 flex flex-col items-center text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#52B788] mb-2">You get back</div>
                        <div className="text-5xl font-black text-white mb-4">₹{currentUserBalance.toLocaleString('en-IN')}</div>
                        <p className="text-white/60 font-medium text-sm">You overpaid for the group. Sit back, others will pay you.</p>
                      </div>
                    ) : currentUserBalance === 0 ? (
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                        <div className="text-3xl font-black text-white mb-2">All Settled!</div>
                        <p className="text-white/60 font-medium text-sm">You paid exactly your share.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-3xl font-black text-white mb-6">
                          You owe <span className="text-red-400">₹{Math.abs(currentUserBalance).toLocaleString('en-IN')}</span>
                        </div>
                        {settlements.filter(s => s.from === CURRENT_USER_ID).map((s, i) => {
                          const toUser = MEMBERS.find(m => m.id === s.to)?.name
                          return (
                            <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/10">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#1a2e26] border-2 border-white/10 flex items-center justify-center">
                                  <ArrowRight className="w-4 h-4 text-white/50" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Pay</div>
                                  <div className="font-bold text-white">{toUser}</div>
                                </div>
                              </div>
                              <span className="font-black text-2xl">₹{s.amount.toLocaleString('en-IN')}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </RevealUp>
    </div>
  )
}
