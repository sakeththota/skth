"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { rsvpSchema, type RsvpInput } from "@/lib/rsvpSchema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; attending: RsvpInput["attending"]; name: string }
  | { kind: "error"; message: string };

const ATTENDING = [
  { value: "yes", label: "I'm in" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Can't" },
] as const;

export function RsvpForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const form = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { name: "", email: "", attending: undefined, partySize: 1 },
  });

  const attending = form.watch("attending");

  const onSubmit = async (values: RsvpInput) => {
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("rsvp:submitted"));
        setStatus({ kind: "success", attending: values.attending, name: values.name });
      } else {
        const message =
          typeof data.error === "string"
            ? data.error
            : "Something went wrong — check your entries and try again.";
        setStatus({ kind: "error", message });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error — please try again." });
    }
  };

  if (status.kind === "success") {
    const coming = status.attending === "yes";
    return (
      <div role="status" className="flex flex-col gap-3">
        <span className="gn-eyebrow">RSVP Locked In</span>
        <h3 className="gn-confirm-title">
          {coming
            ? `Your seat is saved, ${status.name} 🎲`
            : status.attending === "maybe"
              ? "Noted — keep us posted"
              : "Sorry you can't settle with us"}
        </h3>
        <p className="gn-body" style={{ fontSize: "0.98rem" }}>
          {coming
            ? "May the dice roll in your favor. We'll send the address and a nudge before the night."
            : status.attending === "maybe"
              ? "Swing your vote any time before the RSVP deadline."
              : "We'll miss you at the table — next time, the crown is yours to take."}
        </p>
        <Button
          type="button"
          className="gn-btn gn-btn--ghost self-start"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Change my RSVP
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="gn-label">Name</FormLabel>
                <FormControl>
                  <Input className="gn-input" placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="gn-label">Email</FormLabel>
                <FormControl>
                  <Input className="gn-input" inputMode="email" placeholder="you@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="attending"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="gn-label">Are you in?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid-cols-3 gap-2"
                >
                  {ATTENDING.map((o) => (
                    <Label
                      key={o.value}
                      htmlFor={`attending-${o.value}`}
                      className={cn("gn-seg-opt", field.value === o.value && "gn-seg-opt--on")}
                    >
                      <RadioGroupItem id={`attending-${o.value}`} value={o.value} className="sr-only" />
                      {o.label}
                    </Label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {attending === "yes" && (
          <FormField
            control={form.control}
            name="partySize"
            render={({ field }) => (
              <FormItem className="space-y-1.5 sm:max-w-[14rem]">
                <FormLabel className="gn-label">How many settlers? (incl. you)</FormLabel>
                <FormControl>
                  <Input className="gn-input" type="number" min={1} max={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {status.kind === "error" && <p className="gn-error">{status.message}</p>}

        <Button type="submit" className="gn-btn" disabled={status.kind === "submitting"}>
          {status.kind === "submitting" ? "Saving your seat…" : "Send RSVP →"}
        </Button>
      </form>
    </Form>
  );
}
