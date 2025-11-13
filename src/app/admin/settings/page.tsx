
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/admin/ResetPasswordForm';
import { Skeleton } from '@/components/ui/skeleton';

function ResetPasswordSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-7 w-48 ml-4" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
