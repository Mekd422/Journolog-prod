"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Check } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { compressImage } from "@/lib/files";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    public_profile_slug: "",
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("");

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        public_profile_slug: user.public_profile_slug || "",
      });

      setCurrentAvatar(
        user.avatar ? pb.files.getURL(user, user.avatar) : ""
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select an image file",
        }));
        return;
      }

      try {
        const compressed = await compressImage(file);

        if (compressed.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            avatar: "File size must be less than 5MB",
          }));
          return;
        }

        setAvatarFile(compressed);
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressed);

        if (errors.avatar) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.avatar;
            return newErrors;
          });
        }
      } catch (err) {
        console.error("Error compressing avatar:", err);
        setErrors((prev) => ({
          ...prev,
          avatar: "Error processing image",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("bio", formData.bio);
      updateData.append("public_profile_slug", formData.public_profile_slug);

      if (avatarFile) {
        updateData.append("avatar", avatarFile);
      }

      const updatedUser = await pb
        .collection("users")
        .update<User>(user.id, updateData);

      await refresh();
      setSuccessMessage("Profile updated successfully!");
      setAvatarFile(null);
      setAvatarPreview("");
      setCurrentAvatar(
        updatedUser.avatar ? pb.files.getURL(updatedUser, updatedUser.avatar) : ""
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err: unknown) {
      console.error("Update error:", err);

      const e = err as { data?: { data?: Record<string, unknown> }; message?: string };
      if (e.data?.data) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(e.data.data).forEach(([field, value]) => {
          const valObj = value as Record<string, unknown> | undefined;
          const msg = valObj && typeof valObj === "object" && "message" in valObj
            ? String((valObj as { message?: unknown }).message)
            : undefined;
          fieldErrors[field] = msg || "Error in this field";
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          submit: e.message || "Failed to update profile",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="px-8 py-10 lg:px-12">
        <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white p-12 shadow-card">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <p className="text-text-body">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-10 lg:px-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl text-text-primary">Journal Settings</h1>
        <p className="mt-2 text-text-body">
          Manage your profile information and preferences.
        </p>
      </header>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-[8px] bg-white p-8 shadow-card">
            <h2 className="mb-6 font-serif text-xl text-text-primary">
              Profile Photo
            </h2>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-black/5">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : currentAvatar ? (
                    <Image
                      src={currentAvatar}
                      alt="Current avatar"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center">
                      <span className="text-4xl font-serif text-text-body">
                        {formData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="avatar-input"
                  className="block cursor-pointer rounded-[4px] border-2 border-dashed border-black/20 p-6 text-center transition hover:border-accent hover:bg-black/2"
                >
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <Upload className="mx-auto mb-2 h-6 w-6 text-text-body" />
                  <p className="text-sm font-medium text-text-primary">
                    Click to upload a new photo
                  </p>
                  <p className="text-xs text-text-body">PNG, JPG up to 5MB</p>
                </label>

                {errors.avatar && (
                  <p className="text-sm text-red-600">{errors.avatar}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[8px] bg-white p-8 shadow-card space-y-6">
            <h2 className="font-serif text-xl text-text-primary">
              Profile Information
            </h2>

            <Input
              label="Display Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              error={errors.name}
              disabled={isLoading}
            />

            <Textarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and your travel style..."
              error={errors.bio}
              disabled={isLoading}
              rows={4}
            />

            <Input
              label="Public Profile URL"
              name="public_profile_slug"
              value={formData.public_profile_slug}
              onChange={handleInputChange}
              placeholder="your-unique-slug"
              error={errors.public_profile_slug}
              disabled={isLoading}
            />

            {errors.submit && (
              <div className="rounded-[4px] bg-red-50 p-4 text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 rounded-[4px] bg-green-50 p-4 text-sm text-green-700">
                <Check className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
