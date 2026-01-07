// app/signin/page.jsx

import { Suspense } from "react";
import SigninClient from "./SigninClient";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SigninClient />
    </Suspense>
  );
}
