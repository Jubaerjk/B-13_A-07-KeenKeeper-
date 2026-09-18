import Image from "next/image";
import { FiPhoneCall } from "react-icons/fi";
import { FaTrashCan, FaBoxArchive } from "react-icons/fa6";
import { PiBellSimpleZBold } from "react-icons/pi";
import { RiMessageLine } from "react-icons/ri";
import { BiVideo } from "react-icons/bi";

// ===== Constants =====
const CARD = "bg-white rounded-xl shadow-sm border border-gray-100";
const STATUS = {
  green: { label: "On Track", color: "bg-green-500" },
  yellow: { label: "Need Attention", color: "bg-yellow-500" },
  red: { label: "Overdue", color: "bg-red-500" },
};

// ===== Helpers =====
const getStatus = (days) =>
  days < 7 ? STATUS.green : days < 14 ? STATUS.yellow : STATUS.red;

// ===== Sub-components =====
const StatCard = ({ value, label }) => (
  <div
    className={`${CARD} p-6 flex flex-col items-center justify-center text-center`}
  >
    <h4 className="text-3xl font-bold text-[#244D3F] mb-1">{value}</h4>
    <p className="text-[#64748B] text-sm font-medium">{label}</p>
  </div>
);

const ActionItem = ({ icon: Icon, label, danger }) => (
  <button
    type="button"
    aria-label={label}
    className={`${CARD} w-full p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244D3F] ${
      danger ? "text-red-600 hover:bg-red-50" : "text-[#1A1A1A]"
    }`}
  >
    <Icon className={danger ? "" : "text-[#1A1A1A]"} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const CheckInButton = ({ icon: Icon, label }) => (
  <button
    type="button"
    aria-label={label}
    className="flex flex-col items-center justify-center bg-[#F8FAFC] border border-gray-100 text-[#1F2937] py-6 rounded-lg gap-3 w-full hover:bg-[#F1F5F9] hover:border-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244D3F]"
  >
    <Icon className="text-xl" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// ===== Page =====
export default async function FriendPage({ params }) {
  const { id } = await params;

  const res = await fetch("http://localhost:3000/data/friends.json");
  if (!res.ok) throw new Error("Failed to fetch friends data");
  const data = await res.json();

  const friend = data.find((f) => f.id.toString() === id);

  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-center text-gray-500 text-lg">Friend not found</p>
      </div>
    );
  }

  const { label, color } = getStatus(friend.days_since_contact);

  return (
    <main className="w-full bg-[#F8FAFC] py-10">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 sm:px-6">
        {/* ===== Left Column ===== */}
        <aside className="col-span-1 flex flex-col gap-6">
          {/* Profile Card */}
          <section
            className={`${CARD} p-6 flex flex-col items-center text-center`}
          >
            <Image
              src={friend.picture}
              alt={friend.name}
              width={100}
              height={100}
              quality={100}
              priority
              className="rounded-full object-cover shadow-sm mb-4 ring-2 ring-white"
            />
            <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">
              {friend.name}
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${color} mb-3`}
            >
              {label}
            </span>

            {friend.tags?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {friend.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[#64748B] text-sm italic mb-2">
              &ldquo;{friend.bio}&rdquo;
            </p>
            <p className="text-[#64748B] text-sm">
              Preferred:{" "}
              <span className="font-medium capitalize text-[#1A1A1A]">
                {friend.preferred_contact_method}
              </span>
            </p>
          </section>

          {/* Action Buttons */}
          <section className="flex flex-col gap-2">
            <ActionItem icon={PiBellSimpleZBold} label="Snooze 2 Weeks" />
            <ActionItem icon={FaBoxArchive} label="Archive" />
            <ActionItem icon={FaTrashCan} label="Delete" danger />
          </section>
        </aside>

        {/* ===== Right Column ===== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats Row */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              value={friend.days_since_contact}
              label="Days Since Contact"
            />
            <StatCard value={friend.goal} label="Goal (Days)" />
            <StatCard value={friend.next_due_date} label="Next Due" />
          </section>

          {/* Relationship Goal */}
          <section className={`${CARD} p-6 flex justify-between items-center`}>
            <div>
              <p className="font-bold text-[#1A1A1A] mb-1">Relationship Goal</p>
              <p className="text-[#64748B] text-sm">
                Connect every{" "}
                <span className="font-bold text-[#1A1A1A]">
                  {friend.goal} days
                </span>
              </p>
            </div>
            <button
              type="button"
              className="bg-white border border-gray-200 text-[#1A1A1A] text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244D3F]"
            >
              Edit
            </button>
          </section>

          {/* Quick Check-In */}
          <section className={`${CARD} p-6`}>
            <p className="font-bold text-[#1A1A1A] mb-4">Quick Check-In</p>
            <div className="grid grid-cols-3 gap-4">
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
