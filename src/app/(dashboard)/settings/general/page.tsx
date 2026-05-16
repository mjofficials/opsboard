'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrganization } from '@/features/settings/hooks/useOrganization';
import { ReadOnlyBanner } from '@/features/settings/components/ReadOnlyBanner';
import { settingsService } from '@/features/settings/services/settingsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { UploadIcon } from 'lucide-react';
import { Organization } from '@/features/settings/types';

export default function GeneralSettingsPage() {
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const isAdmin = user?.role === 'ADMIN';
  const isMember = user?.role === 'MEMBER';
  const { organization, isLoading, updateOrganization, isUpdating } =
    useOrganization(user?.organization_id);

  const [form, setForm] = useState<Partial<Organization>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name,
      });
      setIsDirty(false);
    }
  }, [organization]);

  const handleChange = (key: keyof Organization, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    const { error } = await updateOrganization(form);
    if (error) {
      toast.error('Failed to save settings', { description: error });
    } else {
      toast.success('Settings saved');
      setIsDirty(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.organization_id) return;
    setIsUploadingAvatar(true);
    try {
      const url = await settingsService.uploadOrgAvatar(user.organization_id, file);
      const { error } = await updateOrganization({ logo_path: url });
      if (error) throw new Error(error);
      toast.success('Logo updated');
    } catch (err: any) {
      toast.error('Failed to upload logo', { description: err.message });
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization&apos;s profile and settings.
        </p>
      </div>

      {isMember && <ReadOnlyBanner />}

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Logo</CardTitle>
          <CardDescription>Shown across the dashboard and emails.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={organization?.logo_path ?? ''} />
            <AvatarFallback className="text-lg font-semibold">
              {organization?.name?.[0]?.toUpperCase() ?? 'O'}
            </AvatarFallback>
          </Avatar>
          {(isAdmin || isOwner) && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                {isUploadingAvatar ? 'Uploading…' : 'Upload Logo'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={form.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isAdmin && !isOwner}
            />
          </div>
          {(isAdmin || isOwner) && (
            <>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || isUpdating}
                >
                  {isUpdating ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
