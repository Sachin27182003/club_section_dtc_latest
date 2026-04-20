import React from "react";
import { Reveal } from "./Reveal";
import { Facebook, Instagram, Linkedin, Twitter } from "@/helpers/footer_svg";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

function Footer() {
  return (
    <>
      {/* Matched the exact light grey background from the image */}
      <footer className="bg-[#e4e5e6] pt-12 px-6 pb-12 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About DTC & Follow */}
          <Reveal className="flex flex-col items-start">
            <h3 className="text-[#ea6c13] font-bold text-[17px] mb-5">
              About DTC
            </h3>
            <Image
            width={27.5}
            height={27.5}
              src="/logo-dtc.png"
              className="w-27.5 h-27.5 rounded-full object-cover mb-6"
              alt="DTC Logo"
            />
            <h3 className="text-[#ea6c13] font-bold text-[17px] mb-4">
              Follow DTC
            </h3>
            <div className="flex gap-3">
              {/* Matched the white circular background with dark grey icons */}
              {[
                {
                  Icon: Facebook,
                  url: "https://www.facebook.com/delhitech.in",
                },
                {
                  Icon: Instagram,
                  url: "https://www.instagram.com/delhi_technical_campus/",
                },
                {
                  Icon: Twitter,
                  url: "https://www.youtube.com/channel/UCRi20xkcs_MowQBlnGMr0Iw",
                },
                {
                  Icon: Linkedin,
                  url: "https://www.linkedin.com/company/delhi-technical-campus-greater-noida/",
                },
              ].map(({ Icon, url }, i) => (
                <a
                  href={url}
                  key={i}
                  className="w-8 h-8 bg-white flex items-center justify-center rounded-full text-gray-600 hover:text-white hover:bg-[#ea6c13] transition-colors shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Column 2: Important Links */}
          <Reveal delay={100} className="flex flex-col items-start">
            <h3 className="text-[#ea6c13] font-bold text-[17px] mb-5">
              Important Links
            </h3>
            <ul className="flex flex-col gap-3 text-[#45478c] text-[15px]">
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/media-coverage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  Media Coverage
                </a>
              </li>
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/aicte-approval/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  AICTE Approval
                </a>
              </li>
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/nirf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  NIRF
                </a>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org/feedback/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  AICTE Feedback
                </a>
              </li>
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/wp-content/uploads/2024/04/fullAICTE-Video-2024-25.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  AICTE Video 2025-26
                </a>
              </li>
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://delhitechnicalcampus.ac.in/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ea6c13] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </Reveal>

          {/* Column 3: Contact Us */}
          <Reveal delay={200} className="flex flex-col items-start">
            <h3 className="text-[#ea6c13] font-bold text-[17px] mb-5">
              Contact Us
            </h3>
            <div className="flex flex-col gap-5 text-[#45478c] text-[15px]">
              {/* Phone Section */}
              <div className="flex items-start gap-3">
                <Phone
                  className="text-[#ea6c13] w-5 h-5 shrink-0 mt-0.5 fill-[#ea6c13]"
                  size={18}
                />
                <p>
                  <a
                    href="tel:+919205752300"
                    className="hover:text-[#ea6c13] hover:underline transition-colors"
                  >
                    9205752300
                  </a>
                  {", "}
                  <a
                    href="tel:+918527687800"
                    className="hover:text-[#ea6c13] hover:underline transition-colors"
                  >
                    8527687800
                  </a>
                  {", "}
                  <br />
                  <a
                    href="tel:01206439103"
                    className="hover:text-[#ea6c13] hover:underline transition-colors"
                  >
                    01206439103
                  </a>
                </p>
              </div>

              {/* Email Section */}
              <div className="flex items-start gap-3">
                <Mail
                  className="text-[#ea6c13] w-5 h-5 shrink-0 mt-0.5 fill-[#ea6c13]"
                  size={18}
                />
                <a
                  href="mailto:info@delhitechnicalcampus.ac.in"
                  className="hover:text-[#ea6c13] hover:underline transition-colors"
                >
                  info@delhitechnicalcampus.ac.in
                </a>
              </div>

              {/* Address Section */}
              <div className="flex items-start gap-3">
                <MapPin
                  className="text-[#ea6c13] w-5 h-5 shrink-0 mt-0.5 fill-[#ea6c13]"
                  size={18}
                />
                <a
                  href="https://maps.google.com/?q=Delhi+Technical+Campus,+28/1,+Knowledge+Park-III,+Greater+Noida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-55 hover:text-[#ea6c13] hover:underline transition-colors"
                >
                  28/1, Knowledge Park-III, Greater Noida - 201306 (U.P.)
                </a>
              </div>
            </div>
          </Reveal>

          {/* Column 4: Location */}
          <Reveal delay={300} className="flex flex-col items-start w-full">
            <h3 className="text-[#ea6c13] font-bold text-[17px] mb-5">
              Location
            </h3>
            <div className="w-full bg-rose-100 p-1 rounded shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.7972968975273!2d77.47366847495091!3d28.474719291230738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cebdaaaaaaaab%3A0xef507664000ad02f!2sDelhi%20Technical%20Campus!5e1!3m2!1sen!2sin!4v1776711709934!5m2!1sen!2sin"
                className="w-full h-45 border-0rounded"
                width="600"
                height="450"
                allowFullScreen
                loading="lazy"
                title="DTC Location Map"
              ></iframe>
            </div>
          </Reveal>
        </div>
      </footer>
    </>
  );
}

export default Footer;
