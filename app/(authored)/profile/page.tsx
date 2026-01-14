"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  company_name: string;
  status: string;
  last_login: string;
  avatar_url: string | null;
  verified: number;
  younet_company: string;
}

/**
 * Renders an editable form field for user profile.
 * @param label - Field label
 * @param id - Field identifier
 * @param value - Current value
 * @param onChange - Change handler
 * @param readOnly - Whether field is read-only
 * @param type - Input type
 */
function ProfileField({
  label,
  id,
  value,
  onChange,
  readOnly = false,
  type = "text",
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
          readOnly
            ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        }`}
      />
    </div>
  );
}

/**
 * Formats date string safely for client-side rendering.
 * Avoids hydration mismatch by only rendering on client after mount.
 */
function FormattedDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const date = new Date(dateString);
    setFormatted(date.toLocaleString("vi-VN"));
  }, [dateString]);

  if (!isMounted) {
    return <span>{dateString}</span>;
  }

  return <span>{formatted}</span>;
}

/**
 * Displays user avatar with initial fallback.
 * @param avatarUrl - Avatar image URL
 * @param fullname - User full name for fallback
 */
function UserAvatar({
  avatarUrl,
  fullname,
}: {
  avatarUrl: string | null;
  fullname: string;
}) {
  const initial = (fullname || "U").slice(0, 1).toUpperCase();

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={fullname}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-white">{initial}</span>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {fullname || "User"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{fullname || "User"}</p>
      </div>
    </div>
  );
}

/**
 * Displays a read-only info badge.
 * @param label - Badge label
 * @param value - Badge value
 * @param variant - Color variant
 */
function InfoBadge({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning";
}) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className={`${baseClasses} ${variantClasses[variant]} w-fit`}>
        {value}
      </span>
    </div>
  );
}

/**
 * User profile page with editable information.
 * Displays user details and allows updates.
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/userinfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data: UserProfile = await res.json();
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback mock data
        const mockData: UserProfile = {
          id: 5867,
          fullname: "AnhTVH",
          email: "anhtvh@younetgroup.com",
          phone: "0123456785",
          department: "pr",
          company_name: "Younet",
          status: "active",
          last_login: "2026-01-14 08:03:32",
          avatar_url:
            "http://api-testing.ynm.local/uploads/9dc7b0bfe4536ab5a346d08c332970efabe6d7f0e1457a5dd5121131d01fe4a5.png",
          verified: 1,
          younet_company: "YouNet Media",
        };
        setProfile(mockData);
        setEditedProfile(mockData);
      }
    };
    fetchProfile();
  }, []);

  const handleFieldChange = (id: string, value: string | number) => {
    setEditedProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/userinfo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProfile),
      });
      if (res.ok) {
        setProfile(editedProfile as UserProfile);
        setIsEditing(false);
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "Có lỗi khi cập nhật thông tin" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi khi cập nhật thông tin" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
    setMessage(null);
  };

  if (!profile || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <UserAvatar
            avatarUrl={profile.avatar_url}
            fullname={profile.fullname}
          />
        </div>

        {/* Status Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <InfoBadge
            label="Trạng thái"
            value={
              profile.status === "active" ? "Hoạt động" : "Không hoạt động"
            }
            variant={profile.status === "active" ? "success" : "warning"}
          />
          <InfoBadge
            label="Xác thực"
            value={profile.verified ? "Đã xác thực" : "Chưa xác thực"}
            variant={profile.verified ? "success" : "warning"}
          />
          <InfoBadge label="Công ty" value={profile.younet_company} />
          <InfoBadge label="Phòng ban" value={profile.department} />
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Thông tin cá nhân
            </h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? "Đang lưu..." : "Lưu"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-6 py-3 border-b ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Họ tên"
                    id="fullname"
                    value={editedProfile.fullname || ""}
                    onChange={(e) =>
                      handleFieldChange("fullname", e.target.value)
                    }
                    readOnly={!isEditing}
                  />
                  <ProfileField
                    label="Email"
                    id="email"
                    type="email"
                    value={editedProfile.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    readOnly={!isEditing}
                  />
                  <ProfileField
                    label="Số điện thoại"
                    id="phone"
                    type="tel"
                    value={editedProfile.phone || ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    readOnly={!isEditing}
                  />
                  <ProfileField
                    label="Phòng ban"
                    id="department"
                    value={editedProfile.department || ""}
                    onChange={(e) =>
                      handleFieldChange("department", e.target.value)
                    }
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin công ty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Tên công ty"
                    id="company_name"
                    value={editedProfile.company_name || ""}
                    onChange={(e) =>
                      handleFieldChange("company_name", e.target.value)
                    }
                    readOnly={!isEditing}
                  />
                  <ProfileField
                    label="Tên công ty YouNet"
                    id="younet_company"
                    value={editedProfile.younet_company || ""}
                    onChange={(e) =>
                      handleFieldChange("younet_company", e.target.value)
                    }
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin khác
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium text-gray-900">
                      {profile.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Đăng nhập lần cuối:</span>
                    <span className="font-medium text-gray-900">
                      <FormattedDate dateString={profile.last_login} />
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Xác thực:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.verified
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {profile.verified ? "Đã xác thực" : "Chưa xác thực"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
