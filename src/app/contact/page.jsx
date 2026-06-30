"use client";

import { useState } from "react";
import { Alert, Button, Input, TextArea } from "@heroui/react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess("Thanks for reaching out! Our support team will contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Have questions about buying, selling, or your account? Send us a message.
        </p>
        <div className="mt-8 space-y-3 text-slate-600 dark:text-slate-300">
          <p>Email: support@tradehub.com</p>
          <p>Phone: +880 1609-247375</p>
          <p>Location: Dhaka, Bangladesh</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-700"
      >
        {success ? <Alert color="success" title={success} /> : null}
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          variant="bordered"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          variant="bordered"
        />
        <TextArea
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          variant="bordered"
          rows={5}
        />
        <Button type="submit" color="primary">
          Send Message
        </Button>
      </form>
    </div>
  );
}
