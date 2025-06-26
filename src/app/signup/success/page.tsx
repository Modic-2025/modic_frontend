"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
