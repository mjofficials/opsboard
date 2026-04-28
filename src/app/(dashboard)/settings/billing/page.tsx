'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrganization } from '@/features/settings/hooks/useOrganization';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CreditCardIcon, CheckIcon } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const { organization, isLoading } = useOrganization(user?.organization_id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const plan = organization?.plan ?? 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>You are on the{' '}
            <Badge variant="secondary" className="capitalize">{plan}</Badge>{' '}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(['free', 'pro', 'enterprise'] as const).map((p) => (
              <div
                key={p}
                className={`rounded-lg border p-4 ${plan === p ? 'border-primary bg-accent' : 'border-border'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold capitalize">{p}</span>
                  {plan === p && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {p === 'free' && 'Up to 3 projects, 5 team members.'}
                  {p === 'pro' && 'Unlimited projects, 25 team members.'}
                  {p === 'enterprise' && 'Unlimited everything + SSO.'}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
          <CardDescription>
            Billing email:{' '}
            <span className="text-foreground font-medium">
              {organization?.billing_email ?? 'Not set'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payment method on file. Upgrade to Pro to add one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
