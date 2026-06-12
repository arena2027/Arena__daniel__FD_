import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { TempPasswordStorage } from '../../services/storage/TempPasswordStorage';
import { useAuth } from '../hooks/AuthContext';

export function OTPPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mock OTP for demo: 123456
  const MOCK_OTP = '123456';

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    if (otpString !== MOCK_OTP) {
      setError('Invalid OTP code. Try 123456 for demo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get temp password from storage
      const tempData = TempPasswordStorage.getTempPassword();
      if (!tempData) {
        setError('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }

      // Log in with stored credentials
      await login(tempData.email, tempData.password);
      TempPasswordStorage.clearTempPassword();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setError(null);
    setOtp(['', '', '', '', '', '']);
    setResendCountdown(30);
    inputRefs.current[0]?.focus();
  };

  const handleBackToAuth = () => {
    TempPasswordStorage.clearTempPassword();
    navigate('/auth');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#111827_0%,#1f2937_45%,#0f172a_100%)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Logo top left */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#ef4444]">
          <img src="/logo.jpg" alt="Arena" className="w-full h-full object-cover" />
        </div>
        <span className="text-white font-black text-lg">Arena</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-8">
          <button
            onClick={handleBackToAuth}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors mb-5"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white mb-1">Enter OTP</h2>
            <p className="text-sm text-white/40">
              We've sent a 6-digit code to your email
            </p>
          </div>

          {/* OTP Input Grid */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-14 bg-white/5 border-2 border-white/10 focus:border-[#ef4444]/50 rounded-xl text-center text-white text-lg font-bold outline-none transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || otp.some(d => !d)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white font-bold text-sm py-3 rounded-full hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-red-500/30 mb-3"
          >
            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleResendOtp}
            disabled={resendCountdown > 0}
            className="w-full text-sm text-[#ef4444] hover:underline disabled:text-white/30 transition-all"
          >
            {resendCountdown > 0
              ? `Resend code in ${resendCountdown}s`
              : "Didn't receive? Resend"}
          </button>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/30 text-center">
              Demo OTP: <span className="text-white/50 font-mono">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
