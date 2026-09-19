import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="page-container py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-error-container text-error flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>
      <h1 className="font-headline-md text-headline-md text-on-surface font-bold mb-3">
        Authentication Error
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8">
        Could not authenticate with the provider or the verification link has expired.
        Please try signing in again.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg font-bold hover:bg-opacity-90 transition-all shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}
