
"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function EnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const enquiry = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiry),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your enquiry.");
      }

      setSuccess(true);
      setMessage(
        result.message || "Your enquiry has been submitted successfully."
      );

      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Start a Project
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-[#0A1830]">
          Tell Us About Your Project
        </h2>

        <p className="mt-3 leading-7 text-slate-500">
          Complete the form below. Our team will review your requirements
          and get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Full Name *
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Email Address *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Phone Number *
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Company / Organisation
            </label>

            <input
              id="company"
              name="company"
              type="text"
              maxLength={150}
              autoComplete="organization"
              placeholder="Company name (optional)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="service"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Service Required *
            </label>

            <select
              id="service"
              name="service"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="Website Design and Development">
                Website Design and Development
              </option>
              <option value="Custom Software Development">
                Custom Software Development
              </option>
              <option value="Education Technology">
                Education Technology / SchoolSuite
              </option>
              <option value="Business Digital Solutions">
                Business Digital Solutions
              </option>
              <option value="Graphics and Digital Content">
                Graphics and Digital Content
              </option>
              <option value="IT Consulting">
                IT Consulting
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="budget"
              className="mb-2 block text-sm font-bold text-[#0A1830]"
            >
              Estimated Project Budget
            </label>

            <select
              id="budget"
              name="budget"
              defaultValue=""
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select budget (optional)</option>
              <option value="Below ₦100,000">Below ₦100,000</option>
              <option value="₦100,000 - ₦500,000">
                ₦100,000 - ₦500,000
              </option>
              <option value="₦500,000 - ₦1,000,000">
                ₦500,000 - ₦1,000,000
              </option>
              <option value="Above ₦1,000,000">
                Above ₦1,000,000
              </option>
              <option value="Not yet decided">Not yet decided</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-bold text-[#0A1830]"
          >
            Tell Us About Your Project *
          </label>

          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Describe what you want us to build or help you achieve..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
              success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {success && <CheckCircle2 size={20} className="shrink-0" />}
            <p>{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Project Enquiry
              <ArrowRight size={19} />
            </>
          )}
        </button>

        <p className="text-xs leading-6 text-slate-400">
          Your information will be used to review and respond to your
          project enquiry.
        </p>
      </form>
    </section>
  );
            }
