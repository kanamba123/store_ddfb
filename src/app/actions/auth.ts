// app/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/config/API";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const res = await fetch(`${API_URL}/ownerstores/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Handle non-successful responses
    if (!res.ok) {
      try {
        const errorData = await res.json();
        return { error: errorData.message || "Login failed" };
      } catch {
        return { error: `Login failed with status ${res.status}` };
      }
    }

    const data = await res.json();
    if (!data?.token) {
      return { error: "Invalid response from server" };
    }

    const cookieStore = cookies();
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    };

    if (cookieStore) {
      (await cookieStore).set("auth-token", data.token, cookieOptions);
      (await cookieStore).set("user", JSON.stringify(data.user || {}), cookieOptions);
    }

    // This will throw NEXT_REDIRECT
    redirect(formData.get("redirect")?.toString() || "/dashboard");
  } catch (err: any) {
    // Special handling for redirects
    if (err.message.includes("NEXT_REDIRECT")) {
      throw err; // Let Next.js handle the redirect
    }

    console.error("Login error:", err);
    return { error: err.message || "An error occurred during login" };
  }
}
