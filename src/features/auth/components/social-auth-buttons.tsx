"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";

export function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    const onSocialSignIn = () => {
      return authClient.signIn.social({ provider, callbackURL: "/" });
    };

    return (
      <Button
        type="button"
        key={provider}
        variant="outline"
        className="cursor-pointer"
        onClick={onSocialSignIn}
      >
        <Icon />
        Continue with {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </Button>
    );
  });
}
