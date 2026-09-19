"use client";

import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";

export default function AIChatPanel() {
  const { isChatOpen, closeChat, activeQuery } = useChat();
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "user",
      text:
        activeQuery ||
        "I have been working as a technician in an automotive workshop in Gurugram for 8 months. The employer hasn't paid salary for October and November (₹38,000 total). When I ask, they threaten to terminate me.",
      time: "11:42 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState(0);

  if (!isChatOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "assistant",
          text: `Analyzing your query against official statutes and welfare directories. We have noted: "${inputText}". Under relevant Indian Code regulations, you are entitled to statutory relief and legal aid.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[620px] lg:w-[680px] bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
      {/* Assistant Header */}
      <div className="bg-primary px-5 sm:px-6 py-4 text-on-primary flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-tertiary-fixed">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-on-primary font-bold tracking-tight leading-none">
                  Adhikaar Assistant
                </span>
                <span className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
                  Live
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-primary-container mt-1">
                Ready to guide you · Impartial &amp; Private
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-primary-container">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "1",
                    sender: "user",
                    text: activeQuery,
                    time: "11:42 AM",
                  },
                ]);
              }}
              className="p-2 hover:bg-surface-container-lowest/10 rounded-lg transition-colors text-on-primary cursor-pointer"
              title="Reset session"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button
              onClick={closeChat}
              className="p-2 hover:bg-surface-container-lowest/10 rounded-lg transition-colors text-on-primary cursor-pointer"
              title="Close assistant"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-surface-container-lowest/10">
          <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm px-2.5 py-1 rounded bg-surface-container-lowest/10 text-on-primary">
            <span className="material-symbols-outlined text-[14px]">folder</span>
            Labour &amp; Wages Case #AD-8492
          </span>
          <span className="font-label-sm text-label-sm text-primary-fixed-dim">
            Jurisdiction: Gurugram, Haryana
          </span>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-5 bg-surface-container-low/40">
        {messages.map((m) =>
          m.sender === "user" ? (
            <div key={m.id} className="flex justify-end items-start gap-2.5 max-w-[88%] self-end">
              <div className="bg-primary text-on-primary p-3.5 sm:p-4 rounded-2xl rounded-tr-none shadow-sm flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim font-semibold">
                  You
                </span>
                <p className="font-body-sm text-body-sm leading-relaxed">{m.text}</p>
                <span className="font-label-sm text-[10px] text-primary-fixed-dim/80 text-right">
                  {m.time}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-3 max-w-[96%] self-start">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm shrink-0 shadow-sm mt-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2 border border-outline-variant/15">
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {m.text}
                </p>
              </div>
            </div>
          )
        )}

        {/* Default Assistant Comprehensive Advice Box (from Stitch) */}
        <div className="flex items-start gap-3 max-w-[98%] self-start mt-2">
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm shrink-0 shadow-sm mt-1">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col gap-3.5 w-full">
            <div className="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-4 border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-primary font-bold">
                  Statutory Wage Protection Advisory
                </span>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-semibold">
                  Verified Counsel
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                Under the <strong>Payment of Wages Act, 1936</strong> and the Industrial Disputes
                framework, you are legally entitled to your wages within <strong>7–10 days</strong>{" "}
                of wage period expiry. Retaliatory termination without due procedure or mandatory
                notice pay is unlawful.
              </p>

              {/* Questionnaire card */}
              <div className="bg-surface-container-low p-4 sm:p-5 rounded-xl flex flex-col gap-3 border border-outline-variant/15">
                <span className="font-label-md text-label-md text-primary font-bold">
                  To generate your customized legal demand letter, please confirm:
                </span>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    1. Employment Status &amp; Contract Type
                  </label>
                  <select className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-3.5 py-2.5 rounded-lg shadow-sm focus:outline-none border border-outline-variant/30">
                    <option>Full-time Contract (Technician)</option>
                    <option>Permanent Direct Roll</option>
                    <option>Daily Wage / Informal Worker</option>
                    <option>Third-Party Agency Deputation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    2. Verified Proof Available
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {["Bank Records", "Appointment Letter", "WhatsApp / Logs"].map((proof, i) => (
                      <label
                        key={proof}
                        className="flex items-center gap-2 bg-surface-container-lowest p-2.5 rounded-lg cursor-pointer shadow-sm border border-outline-variant/20"
                      >
                        <input
                          defaultChecked={i !== 2}
                          className="accent-primary rounded"
                          type="checkbox"
                        />
                        <span className="font-label-sm text-[12px] text-on-surface">{proof}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    3. Desired Resolution Outcome
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Recover Salary + Continue Employment",
                      "Formal Resignation + Full Settlement",
                    ].map((outcome, idx) => (
                      <button
                        key={outcome}
                        type="button"
                        onClick={() => setSelectedOutcome(idx)}
                        className={`font-label-sm text-label-sm px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                          selectedOutcome === idx
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-container-lowest hover:bg-surface-container-highest text-on-surface border border-outline-variant/20"
                        }`}
                      >
                        {outcome}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Action Sequence */}
              <div className="bg-surface-container-lowest rounded-xl flex flex-col gap-3">
                <span className="font-title-md text-title-md text-primary font-bold">
                  Recommended Action Sequence
                </span>

                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-outline-variant/15">
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm shrink-0 mt-0.5 font-bold">
                    1
                  </span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">
                        Issue Formal Demand Notice
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold shrink-0">
                        7-Day Cure Period
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Generated statutory notice citing Section 15 of Payment of Wages Act.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          alert("Downloading customized statutory notice draft (PDF)...")
                        }
                        className="font-label-sm text-label-sm bg-primary text-on-primary px-3.5 py-2 rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        Download Notice Draft (PDF)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-outline-variant/15">
                  <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-label-sm shrink-0 mt-0.5 font-bold">
                    2
                  </span>
                  <div className="flex flex-col flex-1">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      E-File at Samadhan Labour Portal
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Conciliation petition automatically addressed to Assistant Labour
                      Commissioner, Gurugram Circle-II.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-outline-variant/15">
                  <span className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center font-label-sm text-label-sm shrink-0 mt-0.5 font-bold">
                    3
                  </span>
                  <div className="flex flex-col flex-1">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      Connect with Pro-Bono DLSA Advocate
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      District Courts Complex, Gurugram (Free legal aid under Section 12).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 sm:p-5 bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your follow-up query or statutory question..."
            className="flex-1 bg-surface-container-low text-on-surface px-4 py-3 rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20 placeholder:text-outline"
          />
          <button
            type="button"
            onClick={handleSend}
            className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:bg-opacity-90 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        <p className="text-[11px] text-on-surface-variant text-center">
          Adhikaar AI provides statutory citations and guidance under Indian law.
        </p>
      </div>
    </div>
  );
}
