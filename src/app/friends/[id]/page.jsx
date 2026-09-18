import Image from "next/image";
import { FiPhoneCall } from "react-icons/fi";
import { FaTrashCan, FaBoxArchive } from "react-icons/fa6";
import { PiBellSimpleZBold } from "react-icons/pi";
import { RiMessageLine } from "react-icons/ri";
import { BiVideo } from "react-icons/bi";
import { FiCalendar, FiTarget, FiClock, FiEdit3 } from "react-icons/fi";

// ===== Constants =====
const CARD =
  "bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_rgba(15,23,42,0.04)]";

const STATUS = {
  green: {
    label: "On Track",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  yellow: {
    label: "Need Attention",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  red: {
    label: "Overdue",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

// ===== Helpers =====
const getStatus = (days) =>
  days < 7 ? STATUS.green : days < 14 ? STATUS.yellow : STATUS.red;

// ===== Sub-components =====

const StatCard = ({ value, label, icon: Icon }) => (
  <div
    className={`${CARD} group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <h4 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#244D3F]">
          {value}
        </h4>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F4] text-[#244D3F] transition-colors group-hover:bg-[#244D3F] group-hover:text-white">
        <Icon className="text-lg" />
      </div>
    </div>
  </div>
);

const ActionItem = ({ icon: Icon, label, danger }) => (
  <button
    type="button"
    aria-label={label}
    className={`
      group w-full rounded-xl border px-4 py-3.5
      flex items-center gap-3
      transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244D3F]
      ${
        danger
          ? "border-red-100 bg-red-50/50 text-red-600 hover:border-red-200 hover:bg-red-50"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
      }
    `}
  >
    <div
      className={`
        flex h-9 w-9 items-center justify-center rounded-lg
        ${
          danger
            ? "bg-red-100 text-red-600"
            : "bg-slate-100 text-slate-600 group-hover:bg-[#EAF3EF] group-hover:text-[#244D3F]"
        }
      `}
    >
      <Icon className="text-sm" />
    </div>

    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const CheckInButton = ({ icon: Icon, label }) => (
  <button
    type="button"
    aria-label={label}
    className="
      group flex w-full flex-col items-center justify-center
      rounded-xl border border-slate-200
      bg-slate-50/70 py-6
      text-slate-700
      transition-all duration-200
      hover:-translate-y-0.5
      hover:border-[#C8DDD4]
      hover:bg-[#F1F8F5]
      hover:shadow-sm
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-[#244D3F]
    "
  >
    <div
      className="
        flex h-11 w-11 items-center justify-center
        rounded-full bg-white
        text-[#244D3F]
        shadow-sm
        transition-all duration-200
        group-hover:bg-[#244D3F]
        group-hover:text-white
      "
    >
      <Icon className="text-lg" />
    </div>

    <span className="mt-3 text-sm font-semibold">{label}</span>
  </button>
);

// ===== Page =====
export default async function FriendPage({ params }) {
  const { id } = await params;

  const res = await fetch("http://localhost:3000/data/friends.json");

  if (!res.ok) {
    throw new Error("Failed to fetch friends data");
  }

  const data = await res.json();

  const friend = data.find((f) => f.id.toString() === id);

  if (!friend) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className={`${CARD} p-10 text-center`}>
          <p className="text-lg font-semibold text-slate-700">
            Friend not found
          </p>
          <p className="mt-1 text-sm text-slate-400">
            The requested friend could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { label, color, dot } = getStatus(friend.days_since_contact);

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3">
        {/* ================= LEFT COLUMN ================= */}
        <aside className="col-span-1 flex flex-col gap-6">
          {/* Profile Card */}
          <section className={`${CARD} overflow-hidden`}>
            {/* Profile Header Background */}
            <div className="h-24 bg-gradient-to-br from-[#244D3F] to-[#39725F]" />

            <div className="relative px-6 pb-6 text-center">
              {/* Profile Image */}
              <div className="-mt-12 mb-4 flex justify-center">
                <div className="rounded-full bg-white p-1.5 shadow-lg">
                  <Image
                    src={friend.picture}
                    alt={friend.name}
                    width={96}
                    height={96}
                    quality={90}
                    priority
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {friend.name}
              </h1>

              {/* Status */}
              <div
                className={`mx-auto mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${color}`}
              >
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </div>

              {/* Tags */}
              {friend.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {friend.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EDF6F2] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#356A58]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="my-5 border-t border-slate-100" />

              {/* Bio */}
              <p className="text-sm italic leading-relaxed text-slate-500">
                &ldquo;{friend.bio}&rdquo;
              </p>

              {/* Preferred Contact */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Preferred contact:</span>
                <span className="font-semibold capitalize text-slate-800">
                  {friend.preferred_contact_method}
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex flex-col gap-2.5">
            <ActionItem icon={PiBellSimpleZBold} label="Snooze for 2 Weeks" />

            <ActionItem icon={FaBoxArchive} label="Archive Friend" />

            <ActionItem icon={FaTrashCan} label="Delete Friend" danger />
          </section>
        </aside>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
          {/* Stats Row */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              value={friend.days_since_contact}
              label="Days Since Contact"
              icon={FiClock}
            />

            <StatCard
              value={friend.goal}
              label="Contact Goal"
              icon={FiTarget}
            />

            <StatCard
              value={friend.next_due_date}
              label="Next Due"
              icon={FiCalendar}
            />
          </section>

          {/* Relationship Goal */}
          <section className={`${CARD} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3EF] text-[#244D3F] sm:flex">
                  <FiTarget className="text-lg" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">Relationship Goal</p>

                  <p className="mt-1 text-sm text-slate-500">
                    Connect every{" "}
                    <span className="font-bold text-slate-800">
                      {friend.goal} days
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="
                  inline-flex items-center gap-2
                  rounded-lg border border-slate-200
                  bg-white px-3.5 py-2
                  text-sm font-semibold text-slate-700
                  shadow-sm
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#244D3F]
                "
              >
                <FiEdit3 className="text-sm" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          </section>

          {/* Quick Check-In */}
          <section className={`${CARD} p-5 sm:p-6`}>
            <div className="mb-5">
              <p className="font-bold text-slate-900">Quick Check-In</p>

              <p className="mt-1 text-sm text-slate-500">
                Choose how you want to reconnect with {friend.name}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <CheckInButton icon={FiPhoneCall} label="Call" />

              <CheckInButton icon={RiMessageLine} label="Text" />

              <CheckInButton icon={BiVideo} label="Video" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
