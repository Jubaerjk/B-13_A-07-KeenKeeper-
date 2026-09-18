"use client";

import { useMemo, useState } from "react";
import { FiMail, FiSearch } from "react-icons/fi";
import { BsChatText } from "react-icons/bs";
import { FaMobileAlt, FaVideo } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import friends from "../../../public/data/friends.json";

const Timeline = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // -----------------------------------
  // Normalize different contact types
  // -----------------------------------
  const normalizeType = (type) => {
    if (!type) return "unknown";

    const value = type.toString().trim().toLowerCase();

    if (
      value.includes("call") ||
      value.includes("phone") ||
      value.includes("mobile")
    ) {
      return "call";
    }

    if (
      value.includes("video") ||
      value.includes("zoom") ||
      value.includes("meet")
    ) {
      return "video";
    }

    if (
      value.includes("text") ||
      value.includes("message") ||
      value.includes("sms") ||
      value.includes("whatsapp") ||
      value.includes("chat")
    ) {
      return "text";
    }

    if (value.includes("instagram") || value.includes("insta")) {
      return "instagram";
    }

    if (value.includes("email") || value.includes("mail")) {
      return "email";
    }

    return "unknown";
  };

  // -----------------------------------
  // Prepare timeline data
  // -----------------------------------
  const data = useMemo(() => {
    return friends.flatMap((friend) =>
      (friend.interactions || []).map((interaction) => ({
        id: `${friend.id}-${interaction.id}`,
        friendId: friend.id,
        name: friend.name || "Unnamed",
        type: interaction.type || "unknown",
        normalizedType: normalizeType(interaction.type),
        date: interaction.date || "No date available",
        note: interaction.note || "",
        picture: friend.picture,
      })),
    );
  }, []);

  // -----------------------------------
  // Icons
  // -----------------------------------
  const typeIcons = {
    call: <FaMobileAlt />,
    video: <FaVideo />,
    text: <BsChatText />,
    instagram: <AiFillInstagram />,
    email: <FiMail />,
    unknown: <BsChatText />,
  };

  // -----------------------------------
  // Icon colors
  // -----------------------------------
  const typeStyles = {
    call: {
      icon: "text-blue-600",
      bg: "bg-blue-50",
      label: "Call",
    },

    video: {
      icon: "text-purple-600",
      bg: "bg-purple-50",
      label: "Video",
    },

    text: {
      icon: "text-green-600",
      bg: "bg-green-50",
      label: "Text",
    },

    instagram: {
      icon: "text-pink-600",
      bg: "bg-pink-50",
      label: "Instagram",
    },

    email: {
      icon: "text-yellow-600",
      bg: "bg-yellow-50",
      label: "Email",
    },

    unknown: {
      icon: "text-gray-500",
      bg: "bg-gray-100",
      label: "Other",
    },
  };

  // -----------------------------------
  // Filter + Search
  // -----------------------------------
  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return data.filter((item) => {
      const matchesFilter = filter === "all" || item.normalizedType === filter;

      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.type.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [data, filter, search]);

  // -----------------------------------
  // Filter options
  // -----------------------------------
  const filters = [
    { value: "all", label: "All" },
    { value: "call", label: "Calls" },
    { value: "video", label: "Videos" },
    { value: "text", label: "Texts" },
    { value: "instagram", label: "Instagram" },
    { value: "email", label: "Emails" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-teal-600">
            Your connections
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Timeline
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Keep track of your recent conversations and interactions.
          </p>
        </div>

        {/* ================= CONTROLS ================= */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Search */}
          <div className="relative mb-4">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search by name or contact type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RESULT INFO ================= */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Recent interactions
            </p>

            <p className="text-xs text-gray-500">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "interaction" : "interactions"}
            </p>
          </div>

          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* ================= TIMELINE ================= */}
        {filteredData.length > 0 ? (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-[22px] top-0 w-px bg-gray-200 sm:left-[28px]" />

            <div className="space-y-6">
              {filteredData.map((item) => {
                const style =
                  typeStyles[item.normalizedType] || typeStyles.unknown;

                return (
                  <div
                    key={item.id}
                    className="group relative flex gap-4 sm:gap-6"
                  >
                    {/* Timeline Icon */}
                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-gray-50 ${style.bg} ${style.icon} shadow-sm sm:h-14 sm:w-14`}
                    >
                      <span className="text-lg sm:text-xl">
                        {typeIcons[item.normalizedType] || typeIcons.unknown}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:p-5">
                      {/* Top row */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-sm text-gray-500">
                            {style.label} interaction
                          </p>
                        </div>

                        {/* Type Badge */}
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.icon}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                        <span className="h-2 w-2 rounded-full bg-teal-500" />

                        <p className="text-xs text-gray-500 sm:text-sm">
                          {item.last_contacted}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <FiSearch className="text-xl text-gray-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-800">
              No interactions found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing the filter or searching for another friend.
            </p>

            {(filter !== "all" || search) && (
              <button
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
                className="mt-5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
