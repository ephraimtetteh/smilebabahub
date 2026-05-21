import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-[1340px] mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl font-black text-yellow-400">
                SmileBabaHub
              </span>
              <span>😊</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-3">
              Buy. Sell. Eat. Rent. Earn.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Your all-in-one African super app.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center
                  justify-center hover:bg-yellow-400 hover:text-black transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="COMPANY"
            links={[
              ["About Us", "/about"],
              ["Careers", "/careers"],
              ["Press & Media", "/press"],
              ["Contact Us", "/contact"],
            ]}
          />
          <FooterCol
            title="HELP"
            links={[
              ["Help Center", "/help"],
              ["How to Buy", "/how-to-buy"],
              ["How to Sell", "/how-to-sell"],
              ["Returns & Refunds", "/returns"],
            ]}
          />
          <FooterCol
            title="POLICIES"
            links={[
              ["Terms & Conditions", "/terms"],
              ["Privacy Policy", "/privacy"],
              ["Shipping Policy", "/shipping"],
              ["Cookie Policy", "/cookies"],
            ]}
          />
          <FooterCol
            title="USEFUL LINKS"
            links={[
              ["Track Order", "/orders"],
              ["Vendor Signup", "/auth/register?role=vendor"],
              ["Affiliate Program", "/marketer"],
              ["Sitemap", "/sitemap"],
            ]}
          />
        </div>

        <div className="border-t border-gray-800 mt-8 pt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500">
            © 2024 SmileBabaHub.com. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 mr-2">WE ACCEPT</span>
            {["VISA", "MasterCard", "MTN", "Vodafone"].map((p) => (
              <span
                key={p}
                className="bg-white text-gray-900 text-[9px] font-black px-2 py-1 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="text-xs font-black text-yellow-400 tracking-wider mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-xs text-gray-400 hover:text-yellow-400 transition"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Footer