"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Status configuration - hoisted outside component
const STATUS_CONFIG = {
  onTrack: {
    label: "On Track",
    dotColor: "bg-emerald-500",
    ringColor: "ring-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    statText: "text-emerald-600",
  },
  needAttention: {
    label: "Need Attention",
    dotColor: "bg-amber-500",
    ringColor: "ring-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    statText: "text-amber-600",
  },
  overdue: {
    label: "Overdue",
    dotColor: "bg-rose-500",
    ringColor: "ring-rose-500",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    statText: "text-rose-600",
  },
};

const getStatus = (days) => {
  if (days < 7) return STATUS_CONFIG.onTrack;
  if (days < 14) return STATUS_CONFIG.needAttention;
  return STATUS_CONFIG.overdue;
};

// Skeleton loader
const FriendSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full max-w-sm mx-auto animate-pulse border border-slate-100">
    <div className="p-6 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-slate-200" />
      <div className="h-5 w-32 bg-slate-200 rounded mt-4" />
      <div className="h-4 w-24 bg-slate-200 rounded mt-2" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-7 w-24 bg-slate-200 rounded-full mt-4" />
    </div>
  </div>
);

// Stat card - text color now reflects the status
const StatCard = ({ value, label, textColor = "text-slate-800" }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="text-center">
      <h2 className={`text-4xl font-bold tabular-nums ${textColor}`}>
        {value}
      </h2>
      <p className={`text-sm mt-2 font-medium ${textColor} opacity-80`}>
        {label}
      </p>
    </div>
  </div>
);

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFriends = async () => {
      try {
        const res = await fetch("/data/friends.json", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Error fetching friends:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
    return () => controller.abort();
  }, []);

  // Single-pass stats calculation
  const stats = useMemo(() => {
    const counts = { onTrack: 0, needAttention: 0, overdue: 0 };
    friends.forEach((f) => {
      const label = getStatus(f.days_since_contact).label;
      if (label === "On Track") counts.onTrack++;
      else if (label === "Need Attention") counts.needAttention++;
      else counts.overdue++;
    });
    return counts;
  }, [friends]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex flex-col items-center gap-3 p-8 bg-rose-50 rounded-2xl border border-rose-200">
          <span className="text-4xl">😕</span>
          <p className="text-rose-700 font-medium">Failed to load friends</p>
          <p className="text-rose-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ================= Summary Banner ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={friends.length}
          label="Total Friends"
          textColor="text-slate-800"
        />
        <StatCard
          value={stats.onTrack}
          label="On Track"
          textColor={STATUS_CONFIG.onTrack.statText}
        />
        <StatCard
          value={stats.needAttention}
          label="Need Attention"
          textColor={STATUS_CONFIG.needAttention.statText}
        />
        <StatCard
          value={stats.overdue}
          label="Overdue"
          textColor={STATUS_CONFIG.overdue.statText}
        />
      </div>

      {/* ================= Divider ================= */}
      <div className="flex items-center gap-4 my-12">
        <hr className="flex-1 border-slate-200" />
        <h4 className="text-2xl font-bold text-slate-800 whitespace-nowrap">
          Your Friends
        </h4>
        <hr className="flex-1 border-slate-200" />
      </div>

      {/* ================= Friends Grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <FriendSkeleton key={i} />)
          : friends.map((friend) => {
              const status = getStatus(friend.days_since_contact);
              return (
                <Link
                  href={`/friends/${friend.id}`}
                  key={friend.id}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-slate-200 w-full max-w-sm mx-auto"
                >
                  <div className="p-6 flex flex-col items-center">
                    {/* Profile Picture with status ring */}
                    <div className="relative">
                      <Image
                        width={96}
                        height={96}
                        src={friend.picture}
                        alt={`Profile picture of ${friend.name}`}
                        quality={100}
                        className={`w-24 h-24 rounded-full object-cover ring-4 ring-offset-2 ring-offset-white ${status.ringColor}`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ${status.dotColor} ring-2 ring-white`}
                      />
                    </div>

                    {/* Friend Name */}
                    <h3 className="text-lg font-semibold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors">
                      {friend.name}
                    </h3>

                    {/* Last Contact */}
                    <p className="text-slate-500 text-sm mt-1">
                      <span className="font-semibold text-slate-700">
                        {friend.days_since_contact}
                      </span>{" "}
                      days ago
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                      {friend.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.badgeBg} ${status.badgeText}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}
                        />
                        {status.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Empty state */}
      {!loading && friends.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">
            No friends yet. Add some to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Friends;
