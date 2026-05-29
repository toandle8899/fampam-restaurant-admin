import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { apiFetch } from '@/lib/api';
import { formatCents } from '@/lib/stripe';

const MockStripe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clearCart = useCartStore(s => s.clearCart);
  
  const orderId = searchParams.get('order_id');
  const totalParam = searchParams.get('total');
  const total = totalParam ? parseInt(totalParam, 10) : 0;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/checkout');
    }
  }, [orderId, navigate]);

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      await apiFetch('/stripe/mock-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      
      clearCart();
      navigate(`/order/success?order_id=${orderId}`);
    } catch (err) {
      console.error('Failed to mock payment:', err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-6 bg-slate-900 text-slate-50 text-center relative">
          <Link to="/checkout" className="absolute left-4 top-4 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="font-bold text-xl">S</span>
          </div>
          <h1 className="text-xl font-medium opacity-90">Test Payment Mode</h1>
          <p className="text-3xl font-bold mt-2">{formatCents(total)}</p>
          <p className="text-xs text-slate-400 mt-2">fampam.de</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md text-sm">
              <strong className="font-semibold block mb-1">Local Testing Mode Active</strong>
              Since no real Stripe API keys were found (or they are set to mock mode), you've been redirected here to simulate a successful checkout.
            </div>
          </div>
          
          <Button 
            onClick={handleSimulatePayment}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
            {loading ? 'Processing...' : 'Simulate Payment Success'}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Clicking this will hit the mock webhook endpoint, mark the order as paid, and sync it to the Admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MockStripe;
