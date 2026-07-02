import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useSettings } from './settingsComponents';

export function PayoutAccountPage() {
  const { showToast } = useSettings();
  const [bankName, setBankName] = useState('GTBank');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('SportX Fan');

  return (
    <div>
      <p className="px-4 py-3 text-xs text-[#71767b] leading-relaxed border-b border-[#1f1f1f]">
        Add the bank account where your tipster earnings will be paid out. Details are stored locally until payout API is connected.
      </p>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-[#111] border border-[#1f1f1f] rounded-xl">
          <Building2 className="w-8 h-8 text-[#ef4444] shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">Nigerian Bank Account</p>
            <p className="text-xs text-[#71767b]">Payouts processed within 2–3 business days</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Bank Name</label>
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Account Number</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputMode="numeric"
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[#71767b] font-semibold mb-1 block">Account Name</label>
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full bg-[#111] border border-[#1f1f1f] focus:border-[#ef4444]/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (accountNumber.length < 10) {
              showToast('Enter a valid 10-digit account number', 'error');
              return;
            }
            showToast('Payout account saved locally');
          }}
          className="w-full py-2.5 bg-[#ef4444] rounded-full text-sm font-bold text-white hover:bg-[#dc2626] transition-colors"
        >
          Save Payout Account
        </button>
      </div>
    </div>
  );
}
