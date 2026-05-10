import { SmartSplits } from '@/components/smart-splits'

export default function SplitsDemoPage() {
  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-background pb-24">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#262626]">
            Smart Splits Demo
          </h1>
          <p className="text-lg text-[#262626]/60 mt-2">
            A standalone page to test the Smart Splits component without needing a database trip.
          </p>
        </div>
        <SmartSplits />
      </div>
    </div>
  )
}
