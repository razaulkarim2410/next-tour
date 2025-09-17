

"use client";

import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading checkout...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}

