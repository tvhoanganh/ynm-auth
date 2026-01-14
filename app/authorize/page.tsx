"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthorizeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy các tham số OAuth từ URL
  const client_id = searchParams.get("client_id") || "";
  const redirect_uri = searchParams.get("redirect_uri") || "";
  const state = searchParams.get("state") || "";
  const response_type = searchParams.get("response_type") || "code";
  const scope = searchParams.get("scope") || "";
  const code_challenge = searchParams.get("code_challenge") || "";
  const code_challenge_method =
    searchParams.get("code_challenge_method") || "SHA256";
  const flow = searchParams.get("flow") || "possmessage";

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
            client_id,
            redirect_uri,
            state,
            response_type,
            scope,
            code_challenge,
            code_challenge_method,
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

      if (flow === "redirect") {
        window.location.href = `${redirect_uri}?code=${data.code}&state=${state}`;
        return;
      }

      window.opener.postMessage(
        {
          type: "oauth-code",
          code: data.code,
        },
        client_id
      );

      window.close();
    } catch (err) {
      setError("Lỗi kết nối máy chủ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-stretch bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100">
      {/* Left: Landing info */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-0 bg-white border-b-2 sm:border-b-0 sm:border-r-2 border-gray-200 shadow-lg">
        <div className="max-w-md w-full flex flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center leading-tight drop-shadow-sm">
            YNM Auth
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-xs">
            Đăng nhập một chạm, bảo mật tuyệt đối.
            <br />
            <span className="font-semibold text-blue-600">
              Bảo vệ tài khoản của bạn
            </span>{" "}
            với hệ thống xác thực hiện đại.
          </p>
          <ul className="text-gray-500 text-sm flex flex-col gap-2 mt-2">
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>{" "}
              Đăng nhập nhanh chóng
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>{" "}
              Bảo mật chuẩn OAuth 2.0
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full"></span>{" "}
              Hỗ trợ đa nền tảng
            </li>
          </ul>
        </div>
      </div>
      {/* Right: Login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-12 bg-transparent">
        <form
          className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-2xl min-w-[320px] max-w-[95vw] w-full sm:w-[370px] border border-gray-200 backdrop-blur"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-2 mb-2">
            <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-tight">
              Đăng nhập tài khoản
            </h2>
            <span className="text-xs text-gray-500">
              Vui lòng nhập thông tin để tiếp tục
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              id="email"
              className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="text"
              placeholder="Tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              className="rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="password"
              placeholder="Mật khẩu (123456)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center rounded bg-red-50 py-2 px-3 border border-red-200 animate-shake">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-60 mt-2"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthorizeForm />
    </Suspense>
  );
}

