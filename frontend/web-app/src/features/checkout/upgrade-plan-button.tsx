"use client";

import { Crown } from "lucide-react";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { CheckoutDialog } from "@/features/checkout/checkout-dialog";

type UpgradePlanButtonProps = {
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  label?: string;
  withIcon?: boolean;
};

export function UpgradePlanButton({
  className,
  size = "sm",
  variant,
  label = "Ativar plano",
  withIcon = false
}: UpgradePlanButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} variant={variant} className={className} onClick={() => setOpen(true)}>
        {withIcon ? <Crown className="size-4" /> : null}
        {label}
      </Button>
      <CheckoutDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
