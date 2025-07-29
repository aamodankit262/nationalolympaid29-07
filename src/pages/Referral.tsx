
import { useState } from 'react';
import { ArrowLeft, Share2, Copy, Users, Gift, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Referral = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const referralCode = 'SAFE2024REF';
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const referralStats = [
    { label: 'Total Referrals', value: '12', icon: Users, color: 'blue' },
    { label: 'Pending Rewards', value: '₹450', icon: Gift, color: 'yellow' },
    { label: 'Total Earned', value: '₹1250', icon: Trophy, color: 'green' },
    { label: 'Success Rate', value: '67%', icon: Star, color: 'purple' }
  ];

  const transactions = [
    { id: 1, type: 'Earned', amount: '₹50', refereeId: '1221010', date: '12/12/2025', status: 'completed' },
    { id: 2, type: 'Earned', amount: '₹75', refereeId: '1221011', date: '10/12/2025', status: 'completed' },
    { id: 3, type: 'Pending', amount: '₹50', refereeId: '1221012', date: '08/12/2025', status: 'pending' },
    { id: 4, type: 'Earned', amount: '₹100', refereeId: '1221013', date: '05/12/2025', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-safe-blue" />
                <img 
                  src="/assets/064e7ad4-4435-40dc-a788-9b0bdfadd03c.png" 
                  alt="SAFE Academy Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-safe-yellow/20 px-3 py-1 rounded-full">
                <span className="text-safe-blue font-semibold text-sm">Exam Coins: 1200</span>
              </div>
              <div className="w-8 h-8 bg-safe-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">J</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer & Earn</h1>
          <p className="text-gray-600">Share SAFE With Friends And Earn Rewards For Every Successful Referral</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {referralStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      stat.color === 'blue' ? 'text-blue-600' : 
                      stat.color === 'yellow' ? 'text-yellow-600' : 
                      stat.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-100' : 
                    stat.color === 'yellow' ? 'bg-yellow-100' : 
                    stat.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' : 
                      stat.color === 'yellow' ? 'text-yellow-600' : 
                      stat.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {['Overview', 'Refer Now', 'My Rewards'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase().replace(' ', '-')
                      ? 'bg-safe-blue text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">How Referral Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-safe-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Share2 className="w-6 h-6 text-safe-blue" />
                      </div>
                      <h4 className="font-semibold mb-2">Share Your Code</h4>
                      <p className="text-sm text-gray-600">Share your unique referral code with friends</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-safe-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-safe-teal" />
                      </div>
                      <h4 className="font-semibold mb-2">Friends Register</h4>
                      <p className="text-sm text-gray-600">Your friends sign up using your code</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-safe-yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-6 h-6 text-safe-blue" />
                      </div>
                      <h4 className="font-semibold mb-2">Earn Rewards</h4>
                      <p className="text-sm text-gray-600">Get coins for each successful referral</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refer-now' && (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Share Your Referral Code</h3>
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                      <code className="text-lg font-mono text-safe-blue">{referralCode}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </Button>
                    </div>
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share on WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-rewards' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 bg-green-50">
                      <div className="text-lg font-bold text-green-600">₹1250</div>
                      <div className="text-sm text-gray-600">Available Balance</div>
                      <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                        Withdraw
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 bg-yellow-50">
                      <div className="text-lg font-bold text-yellow-600">₹450</div>
                      <div className="text-sm text-gray-600">Pending</div>
                      <div className="text-xs text-gray-500 mt-1">Processing in 3-5 days</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 bg-blue-50">
                      <div className="text-lg font-bold text-blue-600">₹1700</div>
                      <div className="text-sm text-gray-600">Total Earned</div>
                      <div className="text-xs text-gray-500 mt-1">Lifetime earnings</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Transaction History</h4>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <span className={`text-sm font-semibold ${
                              transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              ₹
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{transaction.type} Coins</div>
                            <div className="text-sm text-gray-500">
                              By ID : {transaction.refereeId} , {transaction.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{transaction.amount}</div>
                          <div className={`text-xs ${
                            transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Referral;
