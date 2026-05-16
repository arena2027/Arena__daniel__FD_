import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-black/80 p-6 rounded-2xl border border-white/10">
        <button onClick={() => navigate('/auth')} className="text-sm text-white/50 mb-4">&larr; Back</button>
        <h2 className="text-2xl font-bold text-white mb-2">Not available</h2>
        <p className="text-sm text-white/40">Password reset is not available in this demo.</p>
      </div>
    </div>
  );
}
