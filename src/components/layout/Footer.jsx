import Link from "next/link";
import Image from "next/image";
/* import {
    RiFacebookFill,
    RiInstagramFill,
    RiTwitterXFill,
} from "react-icons/ri"; */

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-[#244D3F] text-base-content rounded p-10">


            {/* === Brand Section === */}
            <div className="text-center text-white">
                <p className="text-4xl font-bold">KeenKeeper</p>
                <p className="w-[600px]">
                    Your personal shelf of meaningful connections. Browse, tend, and
                    nurture the relationships that matter most.
                </p>
            </div>


            <nav>
                <p className="text-xl font-bold text-white">Social Links</p>
                <div className="grid grid-flow-col gap-4">
                    {/* Instagram */}
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#244D3F] hover:bg-[#9bf6ff] transition"
                    >
                        <Image
                            src="/images/instagram.png"
                            alt="logo"
                            width={40}
                            height={40}

                        />
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#244D3F] hover:bg-[#9bf6ff] transition"
                    >
                        <Image
                            src="/images/facebook.png"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                    </a>

                    {/* Twitter/X */}
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#244D3F] hover:bg-[#9bf6ff] transition"
                    >
                        <Image
                            src="/images/twitter.png"
                            alt="logo"
                            width={40}
                            height={40}

                        />
                    </a>
                </div>
            </nav>


            {/* === Legal & Navigation Section === */}
            <aside className="flex justify-between gap-80 text-white">
                <p className="text-left">
                    © {new Date().getFullYear()} KeenKeeper. All rights reserved.
                </p>
                <div className="flex justify-end gap-4">
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Use</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </aside>

        </footer>
    );
};

export default Footer;
