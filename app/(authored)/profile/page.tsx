"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/app/types/UserProfile";
import { BlurDecoration } from "@/components/ui/BlurDecoration";
import { ProfileField } from "./_components/ProfileField";
import { UserAvatar } from "./_components/UserAvatar";
import { InfoBadge } from "./_components/InfoBadge";
import { FormattedDate } from "./_components/FormattedDate";
import { ProfileMessage } from "./_components/ProfileMessage";
import { ProfileLoadingState } from "./_components/ProfileLoadingState";

const MOCK_PROFILE: UserProfile = {
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
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(MOCK_PROFILE);
        setEditedProfile(MOCK_PROFILE);
      }
    };
    fetchProfile();
  }, []);

  const handleFieldChange = (id: string, value: string | number) => {
    setEditedProfile((prev) => ({ ...prev, [id]: value }));
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
    } catch {
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
    return <ProfileLoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <BlurDecoration variant="compact" />

      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <UserAvatar
              avatarUrl={profile.avatar_url}
              fullname={profile.fullname}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
            <div className="bg-linear-to-r from-emerald-500 to-cyan-600 px-6 py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-white">
                Thông tin cá nhân
              </h2>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      type="button"
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors border border-white/30"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      type="button"
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-lg"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    type="button"
                    className="w-full sm:w-auto px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors border border-white/30"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {message && (
              <ProfileMessage type={message.type} text={message.text} />
            )}

            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-emerald-500" />
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
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      readOnly={!isEditing}
                    />
                    <ProfileField
                      label="Số điện thoại"
                      id="phone"
                      type="tel"
                      value={editedProfile.phone || ""}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
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

                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-cyan-500" />
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

                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-slate-500" />
                    Thông tin khác
                  </h3>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
                    <div className="flex justify-between items-center py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        ID
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {profile.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        Trạng thái
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          profile.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {profile.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        Đăng nhập lần cuối
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        <FormattedDate dateString={profile.last_login} />
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        Xác thực
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          profile.verified
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
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
    </div>
  );
}
