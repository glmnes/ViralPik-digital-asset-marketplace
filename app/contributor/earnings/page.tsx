'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign,
  BarChart3,
  Package,
  Upload,
  TrendingUp,
  Settings,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Wallet,
  TrendingDown,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  asset_id: string;
  asset_title: string;
  amount: number;
  type: 'sale' | 'payout';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

interface EarningsData {
  total_earnings: number;
  available_balance: number;
  pending_earnings: number;
  total_sales: number;
  average_sale_price: number;
  last_payout: string | null;
  monthly_earnings: { month: string; earnings: number }[];
  recent_transactions: Transaction[];
}

export default function ContributorEarningsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [earningsData, setEarningsData] = useState<EarningsData>({
    total_earnings: 0,
    available_balance: 0,
    pending_earnings: 0,
    total_sales: 0,
    average_sale_price: 0,
    last_payout: null,
    monthly_earnings: [],
    recent_transactions: []
  });
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user && profile && !profile.is_creator) {
      toast.error('You need to be a verified creator to access this page');
      router.push('/');
      return;
    }

    if (user && profile && !profile.can_earn) {
      toast.info('Earnings are not enabled for your account');
    }

    if (user) {
      fetchEarningsData();
    }
  }, [user, profile, loading, router]);

  const fetchEarningsData = async () => {
    try {
      // Fetch assets to calculate earnings
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('creator_id', user?.id)
        .eq('is_premium', true);

      if (assetsError) throw assetsError;

      // Calculate earnings based on downloads and price
      let totalEarnings = 0;
      let totalSales = 0;
      const transactions: Transaction[] = [];

      if (assets) {
        assets.forEach((asset: any) => {
          const earnings = asset.download_count * asset.price * 0.7; // 70% creator share
          totalEarnings += earnings;
          totalSales += asset.download_count;

          // Create mock transactions for recent sales
          if (asset.download_count > 0) {
            for (let i = 0; i < Math.min(asset.download_count, 3); i++) {
              transactions.push({
                id: `${asset.id}-${i}`,
                asset_id: asset.id,
                asset_title: asset.title,
                amount: asset.price * 0.7,
                type: 'sale',
                status: 'completed',
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
              });
            }
          }
        });
      }

      // Calculate monthly earnings (mock data for now)
      const monthlyEarnings = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyEarnings.push({
          month: monthName,
          earnings: Math.random() * totalEarnings * 0.3 // Random portion of total
        });
      }

      setEarningsData({
        total_earnings: totalEarnings,
        available_balance: totalEarnings * 0.8, // 80% available
        pending_earnings: totalEarnings * 0.2, // 20% pending
        total_sales: totalSales,
        average_sale_price: totalSales > 0 ? totalEarnings / totalSales : 0,
        last_payout: null,
        monthly_earnings: monthlyEarnings,
        recent_transactions: transactions.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 10)
      });

    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoadingData(false);
    }
  };

  const requestPayout = async () => {
    if (earningsData.available_balance < 10) {
      toast.error('Minimum payout amount is $10');
      return;
    }

    toast.success('Payout request submitted! You will receive an email confirmation.');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 min-h-screen border-r border-zinc-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {profile?.username?.[0]?.toUpperCase() || 'C'}
                </span>
              </div>
              <div>
                <h3 className="text-zinc-100 font-semibold">{profile?.username}</h3>
                <p className="text-zinc-400 text-sm">Contributor</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/contributor" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/contributor/assets" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Package className="w-5 h-5" />
                <span>My Assets</span>
              </Link>
              <Link href="/contributor/upload" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </Link>
              <Link href="/contributor/earnings" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg">
                <DollarSign className="w-5 h-5" />
                <span>Earnings</span>
              </Link>
              <Link href="/contributor/analytics" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link href="/contributor/settings" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Earnings</h1>
                <p className="text-zinc-400 mt-1">Track your revenue and payouts</p>
              </div>
              <button
                onClick={requestPayout}
                disabled={!profile?.can_earn || earningsData.available_balance < 10}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Request Payout
              </button>
            </div>
          </div>

          <div className="p-8">
            {!profile?.can_earn && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Earnings Not Enabled</p>
                  <p className="text-yellow-400/80 text-sm mt-1">
                    Your account is not set up to receive earnings. Contact support to enable monetization.
                  </p>
                </div>
              </div>
            )}

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Available Balance */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-zinc-100">
                  ${earningsData.available_balance.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-500 mt-2">Ready for payout</p>
              </div>

              {/* Pending Earnings */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Pending Earnings</p>
                <p className="text-3xl font-bold text-zinc-100">
                  ${earningsData.pending_earnings.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-500 mt-2">Processing period</p>
              </div>

              {/* Total Earnings */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-zinc-400 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-zinc-100">
                  ${earningsData.total_earnings.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-500 mt-2">All time</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-zinc-100">{earningsData.total_sales}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Avg. Sale Price</p>
                <p className="text-2xl font-bold text-zinc-100">
                  ${earningsData.average_sale_price.toFixed(2)}
                </p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Creator Share</p>
                <p className="text-2xl font-bold text-zinc-100">70%</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-400 text-sm mb-1">Last Payout</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {earningsData.last_payout ? new Date(earningsData.last_payout).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Earnings Chart */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Monthly Earnings</h2>
                <div className="space-y-4">
                  {earningsData.monthly_earnings.map((month, index) => (
                    <div key={month.month}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">{month.month}</span>
                        <span className="text-zinc-100 font-medium">${month.earnings.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${(month.earnings / Math.max(...earningsData.monthly_earnings.map(m => m.earnings))) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {earningsData.recent_transactions.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">No transactions yet</p>
                  ) : (
                    earningsData.recent_transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'sale' 
                              ? 'bg-green-500/10' 
                              : 'bg-blue-500/10'
                          }`}>
                            {transaction.type === 'sale' ? (
                              <Download className="w-4 h-4 text-green-400" />
                            ) : (
                              <CreditCard className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-zinc-100 text-sm font-medium">
                              {transaction.asset_title}
                            </p>
                            <p className="text-zinc-500 text-xs">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-zinc-100 font-medium">
                            +${transaction.amount.toFixed(2)}
                          </p>
                          <p className={`text-xs ${
                            transaction.status === 'completed' 
                              ? 'text-green-400' 
                              : transaction.status === 'pending'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Payout Information */}
            <div className="mt-8 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Payout Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Payout Schedule</h3>
                  <p className="text-zinc-400 text-sm">
                    Payouts are processed weekly on Fridays. Minimum payout amount is $10.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Payment Methods</h3>
                  <p className="text-zinc-400 text-sm">
                    Available methods: PayPal, Bank Transfer, Stripe
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Processing Time</h3>
                  <p className="text-zinc-400 text-sm">
                    3-5 business days after payout request approval
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Tax Information</h3>
                  <p className="text-zinc-400 text-sm">
                    Tax documents will be provided for earnings over $600/year
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
