import { InfoIcon } from 'lucide-react';

export function ReadOnlyBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground mb-6">
      <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
      <span>
        Only organization admins can edit these settings. Contact your admin to
        request changes.
      </span>
    </div>
  );
}
