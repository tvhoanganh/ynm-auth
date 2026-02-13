import Link from "next/link";
import { BlurDecoration } from "@/components/ui/BlurDecoration";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { StepItem } from "@/components/landing/StepItem";

/** Home page - Server component. All content is static. */
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <BlurDecoration />

      <div className="relative">
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6 border border-emerald-400/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Account ID — Một tài khoản, mọi ứng dụng
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Quản lý{" "}
              <span className="bg-linear-to-r from-emerald-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                danh tính
              </span>{" "}
              của bạn
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nền tảng Account ID giúp bạn quản lý hồ sơ cá nhân và xác thực
              OAuth an toàn. Một tài khoản duy nhất để đăng nhập mọi nơi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-linear-to-r from-emerald-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-cyan-700 transition-all duration-300"
              >
                Xem hồ sơ của tôi
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4">
              Tính năng chính
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-xl mx-auto mb-14">
              Mọi thứ bạn cần để quản lý Account ID và kết nối an toàn với các
              ứng dụng.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                icon="👤"
                title="Quản lý hồ sơ"
                description="Cập nhật và quản lý thông tin cá nhân một cách dễ dàng. Tên, email, số điện thoại và hơn thế nữa."
              />
              <FeatureCard
                icon="🔐"
                title="Xác thực OAuth"
                description="Đăng nhập an toàn qua OAuth. Quản lý quyền truy cập cho từng ứng dụng mà không chia sẻ mật khẩu."
              />
              <FeatureCard
                icon="✨"
                title="Giao diện hiện đại"
                description="Trải nghiệm mượt mà, responsive trên mọi thiết bị. Thiết kế rõ ràng và dễ sử dụng."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-y border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-14">
              Cách thức hoạt động
            </h2>
            <div className="space-y-8">
              <StepItem
                step={1}
                title="Đăng nhập"
                description="Xác thực tài khoản qua OAuth hoặc đăng nhập thông thường. Chỉ mất vài giây."
              />
              <StepItem
                step={2}
                title="Cập nhật hồ sơ"
                description="Truy cập trang hồ sơ và cập nhật thông tin cá nhân bất kỳ lúc nào."
              />
              <StepItem
                step={3}
                title="Dùng với mọi ứng dụng"
                description="Đăng nhập vào các ứng dụng khác bằng Account ID của bạn một cách nhanh chóng và an toàn."
              />
            </div>
          </div>
        </section>

        {/* Security / Trust */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-8 sm:p-10 border border-slate-700/50 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔒</span>
                  <h2 className="text-2xl font-bold text-white">
                    Bảo mật thông tin
                  </h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với các
                  tiêu chuẩn bảo mật cao nhất. Mọi dữ liệu được mã hóa và lưu
                  trữ an toàn.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  OAuth cho phép bạn chia sẻ quyền truy cập có kiểm soát mà
                  không cần chia sẻ mật khẩu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
              Bạn đã sẵn sàng bắt đầu với Account ID?
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-emerald-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300"
            >
              Truy cập hồ sơ của tôi
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
