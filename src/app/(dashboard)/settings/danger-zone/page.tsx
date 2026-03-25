'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrganization } from '@/features/settings/hooks/useOrganization';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';

export default function DangerZonePage() {
  const { user, logout } = useAuth();
  const { organization, deleteOrganization, isDeleting } = useOrganization(
    user?.organization_id
  );
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');

  const orgName = organization?.name ?? '';
  const isConfirmed = confirmText === orgName;

  const handleDelete = async () => {
    const { error } = await deleteOrganization();
    if (error) {
      toast.error('Failed to delete organization', { description: error });
      return;
    }
    toast.success('Organization deleted');
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Danger Zone</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Irreversible actions. Proceed with caution.
        </p>
      </div>

      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-destructive" />
            <CardTitle className="text-base text-destructive">
              Delete Organization
            </CardTitle>
          </div>
          <CardDescription>
            Permanently delete{' '}
            <span className="font-medium text-foreground">{orgName}</span> and
            all associated data — projects, teams, and billing history. This
            action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Organization
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3">
                    <p>
                      This will permanently delete{' '}
                      <strong>{orgName}</strong> and all its data. All team
                      members will lose access immediately.
                    </p>
                    <Separator />
                    <p className="text-sm">
                      Type{' '}
                      <span className="font-mono font-semibold text-foreground">
                        {orgName}
                      </span>{' '}
                      to confirm:
                    </p>
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder={orgName}
                      autoFocus
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={!isConfirmed || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting…' : 'Delete Organization'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
