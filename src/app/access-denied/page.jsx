import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <section className="grid min-h-[calc(100vh-80px)] w-full place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          You do not have permission to view this page.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go Home
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </section>
  );
}
