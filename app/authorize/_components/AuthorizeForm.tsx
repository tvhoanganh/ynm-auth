"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FLOW_REDIRECT, FLOW_POST_MESSAGE } from "@/constants/oauth";
import { BlurDecoration } from "@/components/ui/BlurDecoration";

export function AuthorizeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clientId = searchParams.get("client_id") || "";
  const redirectUri = searchParams.get("redirect_uri") || "";
  const state = searchParams.get("state") || "";
  const responseType = searchParams.get("response_type") || "code";
  const scope = searchParams.get("scope") || "";
  const codeChallenge = searchParams.get("code_challenge") || "";
  const codeChallengeMethod =
    searchParams.get("code_challenge_method") || "SHA256";
  const flow = searchParams.get("flow") || FLOW_POST_MESSAGE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          oauth: {
            client_id: clientId,
            redirect_uri: redirectUri,
            state,
            response_type: responseType,
            scope,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            flow,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      if (flow === FLOW_REDIRECT) {
        window.location.href = `${redirectUri}?code=${data.code}&state=${state}`;
        return;
      }

      window.opener.postMessage(
        { type: "oauth-code", code: data.code },
        clientId,
      );
      window.close();
    } catch {
      setError("Lỗi kết nối máy chủ");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-10 lg:py-12 order-1 lg:order-2 min-h-screen lg:min-h-0">
      <BlurDecoration variant="compact" />

      <form
        className="relative flex flex-col gap-5 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 min-w-[320px] max-w-[95vw] w-full sm:w-[380px] border border-slate-200/60 dark:border-slate-700/60"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-1.5 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-white tracking-tight">
            Đăng nhập tài khoản
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Nhập thông tin để tiếp tục ủy quyền
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="email"
          >
            Tên đăng nhập
          </label>
          <input
            id="email"
            className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            type="text"
            placeholder="Tên đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm rounded-xl bg-red-50 dark:bg-red-500/10 py-2.5 px-4 border border-red-200/60 dark:border-red-500/20">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="rounded-xl bg-linear-to-r from-emerald-500 to-cyan-600 text-white py-3 font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-cyan-700 transition-all disabled:opacity-60 disabled:pointer-events-none mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
    </div>
  );
}
