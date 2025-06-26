"use client";

import { Suspense } from "react";
import EmailVerificationContent from "./EmailVerificationContent";

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <EmailVerificationContent />
    </Suspense>
  );
}
