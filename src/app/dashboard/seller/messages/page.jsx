"use client";

import { useCallback, useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Button, Card, Input, TextArea } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import { formatDateTime } from "@/lib/format";

export default function SellerMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ buyerName: "", subject: "", body: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/seller/messages");
      if (!response.ok) throw new Error("Failed to load messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setError("");
    try {
      const response = await fetch("/api/seller/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setForm({ buyerName: "", subject: "", body: "" });
      loadMessages();
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Messages" description="Communicate with buyers about orders and products." />

      <Card className="border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Send Message</h2>
        <form onSubmit={handleSend} className="grid gap-4 md:grid-cols-2">
          <Input label="Buyer Name" value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} variant="bordered" />
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} variant="bordered" required />
          <TextArea label="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} variant="bordered" className="md:col-span-2" rows={4} required />
          <Button type="submit" color="primary" isLoading={isSending}>Send Message</Button>
        </form>
      </Card>

      {error ? <BuyerErrorState message={error} onRetry={loadMessages} /> : null}

      {isLoading ? <p className="text-slate-500">Loading messages...</p> : null}
      {!isLoading && messages.length === 0 ? (
        <BuyerEmptyState icon={FaEnvelope} title="No messages yet" description="Buyer conversations will appear here." />
      ) : null}

      {!isLoading && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card key={message.id} className="border border-slate-200 p-5 dark:border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{message.subject}</p>
                  <p className="text-sm text-slate-500">{message.buyerName} · {message.direction}</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{message.body}</p>
                </div>
                <span className="text-xs text-slate-400">{formatDateTime(message.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
