"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons
import { RiHome2Line } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";

const Navbar = () => {
    const pathname = usePathname();

    // ✅ Reusable styles for nav links
    const baseLinkClasses =
        "group relative flex items-center gap-1 no-underline px-3 py-2 rounded-md transition-all duration-300";

    const hoverBgClasses =
        "absolute inset-0 bg-gradient-to-r from-[#E6F4EA] to-[#CDE8D7] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-md";

    return (
        <div>
            <div className="navbar bg-white shadow-md">
                {/* ================= Logo Section ================= */}
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-2xl text-black">
                        <Image
                            src="/icons/logo.png"
                            alt="logo"
                            width={141}
                            height={31}
                        />
                    </Link>
                </div>

                {/* ================= Navigation Links ================= */}
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 gap-2">

                        {/* ---------- Home Link ---------- */}
                        <li className="font-semibold">
                            <Link
                                href="/"
                                className={`${baseLinkClasses} ${pathname === "/"
                                    ? "bg-[#244D3F] text-white"
                                    : "text-slate-500 hover:text-[#244D3F]"
                                    }`}
                            >
                                <RiHome2Line
                                    size={16}
                                    className="relative z-10 group-hover:text-black"
                                />
                                <span className="relative z-10 text-base">Home</span>
                                <span className={hoverBgClasses}></span>
                            </Link>
                        </li>

                        {/* ---------- Timeline Link ---------- */}
                        <li className="font-semibold">
                            <Link
                                href="/timeline"
                                className={`${baseLinkClasses} ${pathname === "/timeline"
                                    ? "bg-[#244D3F] text-white"
                                    : "text-slate-500 hover:text-[#244D3F]"
                                    }`}
                            >
                                <FaRegClock
                                    size={16}
                                    className="relative z-10 group-hover:text-black"
                                />
                                <span className="relative z-10 text-base">Timeline</span>
                                <span className={hoverBgClasses}></span>
                            </Link>
                        </li>

                        {/* ---------- Stats Link ---------- */}
                        <li className="font-semibold">
                            <Link
                                href="/stats"
                                className={`${baseLinkClasses} ${pathname === "/stats"
                                    ? "bg-[#244D3F] text-white"
                                    : "text-slate-500 hover:text-[#244D3F]"
                                    }`}
                            >
                                <FaChartLine
                                    size={16}
                                    className="relative z-10 group-hover:text-black"
                                />
                                <span className="relative z-10 text-base">Stats</span>
                                <span className={hoverBgClasses}></span>
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
