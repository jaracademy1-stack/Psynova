"use client";

import { Button } from "@heroui/react";

import { signOut } from "@/services/auth/actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}
