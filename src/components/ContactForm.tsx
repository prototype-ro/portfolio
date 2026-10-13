"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n-context";
import { holdChapter, triggerOkGesture } from "@/lib/robot-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Led } from "@/components/Led";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

/** Real EmailJS delivery requires all three keys (see .env.example). */
const EMAILJS_READY = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const fieldClass =
  "chamfer-sm h-auto rounded-none border-line bg-bg px-3 py-3 font-mono text-sm text-ink placeholder:text-ink-dim/60 focus-visible:border-accent focus-visible:ring-0 aria-invalid:border-accent";

export function ContactForm() {
  const { t } = useI18n();
  const [sending, setSending] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: FormValues) {
    if (sending) return; // guard against double submit

    // Honeypot: bots fill every field. Humans never see this one.
    if (honeypotRef.current?.value) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      triggerOkGesture();
      toast.success(t("contact.form.success"));
      form.reset();
      return;
    }

    setSending(true);
    try {
      if (EMAILJS_READY) {
        await emailjs.send(
          SERVICE_ID as string,
          TEMPLATE_ID as string,
          {
            from_name: values.name,
            from_email: values.email,
            message: values.message,
          },
          { publicKey: PUBLIC_KEY as string },
        );
      } else {
        // No keys yet → simulated mode so the UX stays complete.
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (process.env.NODE_ENV !== "production") {
          console.info(
            "[contact] EmailJS não configurado — envio simulado.",
            values,
          );
        }
      }
      triggerOkGesture();
      toast.success(t("contact.form.success"));
      form.reset();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[contact] falha no envio", error);
      }
      toast.error(t("contact.form.error.send"));
    } finally {
      setSending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onFocusCapture={() => holdChapter("contato")}
        onBlurCapture={(event) => {
          const next = event.relatedTarget as Node | null;
          if (!next || !event.currentTarget.contains(next)) {
            holdChapter(null);
          }
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Honeypot — hidden from humans and assistive tech. */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-mono">
                {t("contact.form.name")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("contact.form.name.placeholder")}
                  autoComplete="name"
                  className={fieldClass}
                  {...field}
                />
              </FormControl>
              <FormMessage message={t("contact.form.error.name")} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-mono">
                {t("contact.form.email")}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("contact.form.email.placeholder")}
                  autoComplete="email"
                  className={fieldClass}
                  {...field}
                />
              </FormControl>
              <FormMessage message={t("contact.form.error.email")} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-mono">
                {t("contact.form.message")}
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder={t("contact.form.message.placeholder")}
                  className={`${fieldClass} min-h-32 resize-y`}
                  {...field}
                />
              </FormControl>
              <FormMessage message={t("contact.form.error.message")} />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <span className="label-mono-sm flex items-center gap-2">
            <Led blink={sending} on={!sending} />
            {t("contact.form.disableHints")}
          </span>
          <button
            type="submit"
            disabled={sending}
            className="te-key chamfer inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-ink transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? t("contact.form.sending") : t("contact.form.send")}
          </button>
        </div>

        {!EMAILJS_READY && process.env.NODE_ENV !== "production" ? (
          <p className="label-mono-sm text-accent">
            {"// "}
            {t("contact.form.simulated")}
          </p>
        ) : null}
      </form>
    </Form>
  );
}
