import Link from "next/link";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-muted">Welcome back to ToneRecipes.</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              placeholder="********"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Log in
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          className="w-full rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted">
          No account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
