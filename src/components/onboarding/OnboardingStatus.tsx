
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OnboardingStatusProps {
  status: 'pending' | 'active' | 'historic_pending' | 'historic_complete' | 'suspended';
  subscriptionTier: string;
}

const OnboardingStatus = ({ status, subscriptionTier }: OnboardingStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5 text-orange-500" />,
          title: 'Subscription Pending',
          description: 'Your subscription request is being reviewed by our team',
          badge: 'Pending Approval',
          badgeVariant: 'secondary' as const
        };
      case 'active':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: 'Account Active',
          description: 'Your subscription is active and ready to use',
          badge: 'Active',
          badgeVariant: 'default' as const
        };
      case 'historic_pending':
        return {
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          title: 'Historic Import in Progress',
          description: 'Your material history is being imported. Limited access until complete.',
          badge: 'Import Pending',
          badgeVariant: 'secondary' as const
        };
      case 'historic_complete':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: 'Historic Import Complete',
          description: 'Your material history has been successfully imported',
          badge: 'Complete',
          badgeVariant: 'default' as const
        };
      case 'suspended':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: 'Account Suspended',
          description: 'Please contact support to resolve account issues',
          badge: 'Suspended',
          badgeVariant: 'destructive' as const
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          title: 'Status Unknown',
          description: 'Please contact support',
          badge: 'Unknown',
          badgeVariant: 'secondary' as const
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {config.icon}
            Account Status
          </span>
          <Badge variant={config.badgeVariant}>
            {config.badge}
          </Badge>
        </CardTitle>
        <CardDescription>
          Current subscription: {subscriptionTier}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="font-medium">{config.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStatus;
