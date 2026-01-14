import Link from "next/link";

/**
 * Feature card component - Server component
 * Pure presentational component with no interactivity
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Home page - Server component
 * No client-side state needed, all content is static
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Quản lý hồ sơ cá nhân
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nền tảng quản lý hồ sơ và xác thực OAuth tiên tiến. Cập nhật thông
            tin cá nhân một cách dễ dàng và an toàn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Xem hồ sơ của tôi
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tính năng chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="👤"
              title="Quản lý hồ sơ"
              description="Cập nhật và quản lý thông tin cá nhân của bạn một cách dễ dàng. Thay đổi tên, email, số điện thoại và các thông tin khác."
            />
            <FeatureCard
              icon="🔐"
              title="Xác thực OAuth"
              description="Đăng nhập an toàn thông qua các nền tảng OAuth được hỗ trợ. Quản lý quyền truy cập cho các ứng dụng khác."
            />
            <FeatureCard
              icon="✨"
              title="Giao diện hiện đại"
              description="Trải nghiệm người dùng mượt mà và trực quan. Thiết kế responsive hoạt động tốt trên tất cả các thiết bị."
            />
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Cách thức hoạt động
          </h2>
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Đăng nhập
                </h3>
                <p className="text-gray-600 mt-1">
                  Xác thực tài khoản của bạn thông qua OAuth hoặc thông tin đăng
                  nhập thông thường.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cập nhật hồ sơ
                </h3>
                <p className="text-gray-600 mt-1">
                  Truy cập trang hồ sơ cá nhân và cập nhật thông tin của bạn bất
                  kỳ lúc nào.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sử dụng với các ứng dụng khác
                </h3>
                <p className="text-gray-600 mt-1">
                  Đăng nhập vào các ứng dụng khác sử dụng tài khoản OAuth của
                  bạn một cách nhanh chóng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔒 Bảo mật thông tin
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với các tiêu
              chuẩn bảo mật cao nhất. Mọi dữ liệu được mã hóa và lưu trữ an
              toàn.
            </p>
            <p className="text-gray-600 leading-relaxed">
              OAuth cho phép bạn chia sẻ quyền truy cập một cách kiểm soát mà
              không cần chia sẻ mật khẩu của mình.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-200">
        <p className="text-gray-600 mb-4">Bạn đã sẵn sàng bắt đầu?</p>
        <Link
          href="/profile"
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Truy cập hồ sơ của tôi
        </Link>
      </div>
    </div>
  );
}
