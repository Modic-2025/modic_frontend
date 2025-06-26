"use client";

import { Suspense } from "react";
import SetPasswordContent from "./SetPasswordContent";

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <SetPasswordContent />
    </Suspense>
  );
}
