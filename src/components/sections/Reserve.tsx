import { useState } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

const Reserve = () => {
  const { t } = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:30");
  const [party, setParty] = useState("2");
  
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Calculate today's date string (YYYY-MM-DD) for the min attribute
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const allTimes = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
  
  // Filter available times if the user selected today's date
  const availableTimes = allTimes.filter(tm => {
    if (date === todayStr) {
      const [hours, minutes] = tm.split(':').map(Number);
      const nowHours = d.getHours();
      const nowMinutes = d.getMinutes();
      
      if (hours > nowHours) return true;
      if (hours === nowHours && minutes > nowMinutes) return true;
      return false;
    }
    return true;
  });

  // If the user changes the date to today and their currently selected time has already passed,
  // auto-select the first available time to prevent submitting invalid times.
  if (availableTimes.length > 0 && !availableTimes.includes(time)) {
    setTime(availableTimes[0]);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    if (availableTimes.length === 0) {
      setSubmitError("No available times left for today.");
      setIsSubmitting(false);
      return;
    }

    try {
      await apiFetch("/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          date,
          time,
          party_size: parseInt(party, 10),
        })
      });

      setConfirmed(true);
    } catch (err: any) {
      console.error("Reservation error:", err);
      setSubmitError(err.message || "Failed to submit reservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setConfirmed(false);
    setName("");
    setEmail("");
    setMessage("");
    setDate("");
    setTime("19:30");
  };

  return (
    <section id="reserve" aria-labelledby="reserve-title" className="hairline-t bg-background">
      <div className="container mx-auto max-w-xl px-4 py-20 md:py-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <span data-edit-key="i18n.reserve.kicker" className="label-kicker text-muted-foreground">{t("reserve.kicker")}</span>
          <h2
            id="reserve-title"
            data-edit-key="i18n.reserve.title"
            className="mt-3 font-serif-display text-4xl leading-tight md:text-5xl"
          >
            {t("reserve.title")}
          </h2>
          <p data-edit-key="i18n.reserve.helper" className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {t("reserve.helper")}
          </p>
        </motion.div>

        {confirmed ? (
          <div className="hairline animate-fade-up mx-auto max-w-md rounded-md bg-surface p-6 text-center text-[#15191a]">
            <div className="inline-flex items-center gap-2 font-mono-data text-xs font-bold text-[#2b3620]">
              {t("reserve.confirmed")}
            </div>
            <p className="mt-3 font-serif-display text-2xl text-[#15191a]" data-edit-key="i18n.reserve.requested">{t("reserve.requested")}</p>
            <p className="mt-2 font-mono-data text-xs text-[#15191a]/70">
              {name} · {date || "TBD"} · {time} · {t("reserve.partyOf")} {party}
            </p>
            <p className="mt-4 text-sm text-[#15191a]/80">
              <span data-edit-key="i18n.reserve.received_part1">{t("reserve.received_part1")}</span> <span className="font-semibold text-[#2b3620]">{email}</span> <span data-edit-key="i18n.reserve.received_part2">{t("reserve.received_part2")}</span>
            </p>
            <button
              onClick={reset}
              className="mt-6 font-mono-data text-[11px] text-[#15191a]/60 underline underline-offset-4 hover:text-[#15191a]"
            >
              <span data-edit-key="i18n.reserve.make_another">{t("reserve.make_another")}</span>
            </button>
          </div>
        ) : (
          <motion.form 
            onSubmit={submit} 
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label={t("reserve.field.name")}>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder={t("reserve.placeholder.name")}
                />
              </Field>
              <Field label={t("reserve.field.email")}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder={t("reserve.placeholder.email")}
                />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label={t("reserve.field.date")}>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label={t("reserve.field.date")}
                  className="w-full bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none"
                />
              </Field>
              <Field label={t("reserve.field.time")}>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-label={t("reserve.field.time")}
                  className="w-full bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none"
                  disabled={availableTimes.length === 0}
                >
                  {availableTimes.length === 0 ? (
                    <option value="" className="bg-background">No times left</option>
                  ) : (
                    availableTimes.map((tm) => (
                      <option key={tm} value={tm} className="bg-background">
                        {tm}
                      </option>
                    ))
                  )}
                </select>
              </Field>
              <Field label={t("reserve.field.party")}>
                <select
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  aria-label={t("reserve.field.party")}
                  className="w-full bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n} className="bg-background">
                      {n} {n > 1 ? t("reserve.guests") : t("reserve.guest")}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t("reserve.field.requests")}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full resize-none bg-transparent font-mono-data text-base md:text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder={t("reserve.placeholder.requests")}
              />
            </Field>

            {submitError && (
              <p className="text-center font-mono-data text-xs text-red-500">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 md:mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald px-4 py-4 md:py-5 text-[#15191a] font-bold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald disabled:opacity-50"
            >
              <span data-edit-key="i18n.reserve.submit" className="label-kicker text-sm md:text-base">{isSubmitting ? t("reserve.submitting") : t("reserve.submit")}</span>
              {!isSubmitting && <span className="font-mono-data text-sm">⏎</span>}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-2 border-b border-border/15 pb-3 transition-colors focus-within:border-emerald/60">
    <span className="label-kicker text-muted-foreground">{label}</span>
    <div>{children}</div>
  </label>
);

export default Reserve;
