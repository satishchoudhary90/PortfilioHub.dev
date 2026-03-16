"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Sparkles, Save } from "lucide-react";

export default function ProfilePage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          headline: data.headline || "",
          location: data.location || "",
          website: data.website || "",
          phone: data.phone || "",
        });
      })
      .catch(() => {});
  }, [reset]);

  async function onSubmit(data: ProfileInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast({ title: "Profile updated", variant: "success" });
      } else {
        const json = await res.json();
        addToast({ title: json.error || "Failed to update", variant: "error" });
      }
    } catch {
      addToast({ title: "Something went wrong", variant: "error" });
    }
    setIsLoading(false);
  }

  async function generateBio() {
    setIsGenerating(true);
    try {
      const name = watch("name");
      const headline = watch("headline");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bio", context: `Name: ${name}, Role: ${headline}` }),
      });
      const data = await res.json();
      if (data.text) {
        setValue("bio", data.text);
        addToast({ title: "Bio generated!", variant: "success" });
      }
    } catch {
      addToast({ title: "Failed to generate bio", variant: "error" });
    }
    setIsGenerating(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your personal information</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>This information will be displayed on your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} />
                  {errors.username && <p className="text-red-400 text-xs">{errors.username.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" placeholder="Full Stack Developer" {...register("headline")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">Bio</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateBio} disabled={isGenerating}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isGenerating ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea id="bio" rows={4} placeholder="Tell us about yourself..." {...register("bio")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="San Francisco, CA" {...register("location")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://example.com" {...register("website")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" {...register("phone")} />
              </div>

              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
