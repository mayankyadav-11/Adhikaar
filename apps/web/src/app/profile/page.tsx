"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/apiClient";
import { CitizenProfile, CreateProfileDto, UpdateProfileDto } from "@adhikaar/shared";
import { Loader, LoadingScreen } from "@/components/ui/Loader";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Transgender",
  "Prefer not to say",
];

const CATEGORY_OPTIONS = [
  "General",
  "Other Backward Class (OBC)",
  "Scheduled Caste (SC)",
  "Scheduled Tribe (ST)",
  "Economically Weaker Section (EWS)",
  "Religious / Linguistic Minority",
];

const INCOME_OPTIONS = [
  "Below ₹1,00,000 / year (Antyodaya / BPL)",
  "₹1,00,000 – ₹2,50,000 / year",
  "₹2,50,000 – ₹5,00,000 / year",
  "₹5,00,000 – ₹8,00,000 / year (EWS ceiling)",
  "Above ₹8,00,000 / year",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi (हिंदी)",
  "Punjabi (ਪੰਜਾਬੀ)",
  "Bengali (বাংলা)",
  "Marathi (मराठी)",
  "Gujarati (ગુજરાતી)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
  "Kannada (ಕನ್ನಡ)",
  "Malayalam (മലയാളം)",
  "Odia (ଓଡ଼ିଆ)",
  "Urdu (اردو)",
  "Other",
];

export default function ProfilePage() {
  const { user, session, isLoading: isAuthLoading, openAuthModal } = useAuth();

  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    age: "",
    gender: "",
    occupation: "",
    income_band: "",
    category: "",
    language: "",
  });

  const loadProfile = useCallback(async () => {
    if (!session?.access_token) return;

    setIsLoadingProfile(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.getProfile(session.access_token);
      if (response.profile) {
        setProfile(response.profile);
        setFormData({
          name: response.profile.name || "",
          state: response.profile.state || "",
          district: response.profile.district || "",
          age: response.profile.age !== null && response.profile.age !== undefined ? String(response.profile.age) : "",
          gender: response.profile.gender || "",
          occupation: response.profile.occupation || "",
          income_band: response.profile.income_band || "",
          category: response.profile.category || "",
          language: response.profile.language || "",
        });
      } else {
        // No saved profile yet; seed initial name from auth metadata
        const initialName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
        setProfile(null);
        setFormData((prev) => ({
          ...prev,
          name: initialName,
        }));
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load profile details.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [session?.access_token, user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    if (!isAuthLoading && session?.access_token) {
      loadProfile();
    } else if (!isAuthLoading && !session) {
      setIsLoadingProfile(false);
    }
  }, [isAuthLoading, session, loadProfile]);

  const handleEditClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    // Sync current values into form
    setFormData({
      name: profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
      state: profile?.state || "",
      district: profile?.district || "",
      age: profile?.age !== null && profile?.age !== undefined ? String(profile.age) : "",
      gender: profile?.gender || "",
      occupation: profile?.occupation || "",
      income_band: profile?.income_band || "",
      category: profile?.category || "",
      language: profile?.language || "",
    });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditing(false);
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    let parsedAge: number | null = null;
    if (formData.age.trim()) {
      const num = Number(formData.age);
      if (isNaN(num) || num < 0 || num > 130) {
        setErrorMessage("Please enter a realistic age between 0 and 130.");
        return;
      }
      parsedAge = Math.floor(num);
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      name: formData.name.trim(),
      state: formData.state.trim() || null,
      district: formData.district.trim() || null,
      age: parsedAge,
      gender: formData.gender.trim() || null,
      occupation: formData.occupation.trim() || null,
      income_band: formData.income_band.trim() || null,
      category: formData.category.trim() || null,
      language: formData.language.trim() || null,
    };

    try {
      let updated: CitizenProfile;
      if (profile) {
        updated = await apiClient.updateProfile(session.access_token, payload as UpdateProfileDto);
      } else {
        updated = await apiClient.createProfile(session.access_token, payload as CreateProfileDto);
      }

      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully. These details are saved for your future civic assistance.");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Loading auth state
  if (isAuthLoading) {
    return <LoadingScreen message="Checking session..." />;
  }

  // 2. Unauthenticated user
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-10 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-semibold mb-3">
            Authentication Required
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            Please sign in to view and manage your citizen profile. An Adhikaar profile is optional and helps provide personalized scheme and legal guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openAuthModal("signin")}
              className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              Sign In to Your Account
            </button>
            <Link
              href="/"
              className="border border-outline-variant/40 text-on-surface font-label-md px-6 py-2.5 rounded-full hover:bg-surface-container transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Loading profile data
  if (isLoadingProfile) {
    return <LoadingScreen message="Loading citizen profile..." />;
  }

  const displayName = profile?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Citizen";
  const userInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AD";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-label-sm font-semibold mb-1">
            <span className="material-symbols-outlined text-[18px]">badge</span>
            Citizen Profile & Standing
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            My Profile
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Your saved information is optional and reusable across Ask Adhikaar guidance and scheme eligibility checks.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 self-start sm:self-auto bg-primary text-on-primary font-label-md px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-secondary-fixed/30 border border-secondary/30 text-on-secondary-container flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
            check_circle
          </span>
          <div className="text-body-sm font-medium">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">
            error
          </span>
          <div className="text-body-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account Identity (Read-only) */}
        <div className="md:col-span-1">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-md">
                  {userInitials}
                </div>
                <span
                  title="Active Supabase Account"
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface-container-low"
                />
              </div>

              <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                {displayName}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-full mt-0.5">
                {user.email}
              </p>

              <div className="mt-4 pt-4 border-t border-outline-variant/20 w-full text-left space-y-3">
                <div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                    Citizen Dossier
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface font-mono">
                    #{user.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                    Account Status
                  </span>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Authenticated
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">lock</span>
                    <span className="truncate">{user.email}</span>
                  </span>
                  <span className="text-[11px] text-on-surface-variant/70 italic mt-0.5 block">
                    Secured via authentication provider
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information (View or Edit Mode) */}
        <div className="md:col-span-2">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/20">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                    Personal Information
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Optional demographic data to simplify future scheme matching.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Full Name
                  </span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {profile?.name || user.user_metadata?.full_name || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    State / UT
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.state ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.state || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    District
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.district ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.district || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Age
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.age !== null && profile?.age !== undefined
                        ? "text-on-surface font-medium"
                        : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.age !== null && profile?.age !== undefined ? `${profile.age} years` : "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Gender
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.gender ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.gender || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Occupation / Livelihood
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.occupation ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.occupation || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Annual Income Range
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.income_band ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.income_band || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Social Category
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.category ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.category || "Not added"}
                  </span>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">
                    Preferred Language
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      profile?.language ? "text-on-surface font-medium" : "text-on-surface-variant/60 italic"
                    }`}
                  >
                    {profile?.language || "Not added"}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Optional fields can be updated or cleared anytime without affecting your account.
                </p>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="font-label-md text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Details
                </button>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form
              onSubmit={handleSaveClick}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/20">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                    Edit Profile Details
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Update your details. All demographic fields are optional.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="profile-name" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-state" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      State / Union Territory
                    </label>
                    <select
                      id="profile-state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">Select State / UT (Optional)</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="profile-district" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      District
                    </label>
                    <input
                      id="profile-district"
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="e.g. Ludhiana, Pune, Patna"
                    />
                  </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-age" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      Age (Years)
                    </label>
                    <input
                      id="profile-age"
                      type="number"
                      min="0"
                      max="130"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      placeholder="e.g. 32"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-gender" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      Gender
                    </label>
                    <select
                      id="profile-gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">Select Gender (Optional)</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Occupation */}
                <div>
                  <label htmlFor="profile-occupation" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                    Occupation / Livelihood
                  </label>
                  <input
                    id="profile-occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    placeholder="e.g. Farmer, Student, Artisan, Small Business"
                  />
                </div>

                {/* Income Band & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-income" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      Annual Family Income Range
                    </label>
                    <select
                      id="profile-income"
                      value={formData.income_band}
                      onChange={(e) => setFormData({ ...formData, income_band: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">Select Income Range (Optional)</option>
                      {INCOME_OPTIONS.map((inc) => (
                        <option key={inc} value={inc}>
                          {inc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="profile-category" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                      Social Category
                    </label>
                    <select
                      id="profile-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">Select Category (Optional)</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="profile-language" className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                    Preferred Language for Assistance
                  </label>
                  <select
                    id="profile-language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="">Select Preferred Language (Optional)</option>
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-outline-variant/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelClick}
                  className="font-label-md px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-container transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader size="xs" label="Saving profile..." />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
