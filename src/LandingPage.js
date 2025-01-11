import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import "./landingPage.css"; // berisi .bg-landing-gradient

const LandingPage = () => {
  const navigate = useNavigate();

  // Data gambar slider (hero slideshow)
  const images = [
    "https://storage.googleapis.com/prime-rp-indonesia/prime1.png",
    "https://storage.googleapis.com/prime-rp-indonesia/prime2.png",
    "https://storage.googleapis.com/prime-rp-indonesia/prime3.png",
    "https://storage.googleapis.com/prime-rp-indonesia/prime4.png",
    "https://storage.googleapis.com/prime-rp-indonesia/prime5.png",
    "https://storage.googleapis.com/prime-rp-indonesia/prime6.png",
  ];

  // State index gambar aktif
  const [currentIndex, setCurrentIndex] = useState(0);

  // State mendeteksi apakah user sudah scroll (untuk efek navbar mengecil)
  const [isScrolled, setIsScrolled] = useState(false);

  // **State overlay**: true = tampilkan pesan awal (under development)
  const [showOverlay, setShowOverlay] = useState(true);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Pantau scroll untuk ubah state isScrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk menutup overlay
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="min-h-screen w-full bg-landing-gradient text-[#333] overflow-auto relative">
      {/* 
        OVERLAY PENGUMUMAN 
        Muncul di atas segalanya (z-[999]), 
        memblok konten di belakang sampai ditutup
      */}
      {showOverlay && (
        <div
          className="
            fixed inset-0 z-[999] 
            bg-black/60 
            backdrop-blur-sm
            flex items-center justify-center
            px-4
          "
        >
          {/* Konten Overlay */}
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-[#098c83]">
              Website Under Development
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Kami masih menyempurnakan halaman ini. Jika ingin memantau jumlah
              pemain online, silakan klik tombol <b>"Status Player"</b>
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button
                onClick={handleCloseOverlay}
                className="bg-[#098c83] hover:bg-[#07a193] text-white px-5 py-2 rounded-md font-semibold"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: NAVBAR */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          bg-white/80 backdrop-blur
          shadow-md
          transition-all duration-300
          flex items-center justify-between
          px-8
          ${isScrolled ? "h-14" : "h-20"}
        `}
      >
        {/* Logo + Judul */}
        <div className="flex items-center space-x-3 ">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className={`
              object-contain
              transition-all duration-300
              ${isScrolled ? "w-8 h-8" : "w-12 h-12"}
            `}
          />
          <span
            className={`
              font-semibold text-[#098c83]
              transition-all duration-300
              ${isScrolled ? "text-lg" : "text-xl"}
            `}
          >
            #Everything will be prime
          </span>
        </div>

        {/* Tambahkan tombol tombol opsional di Navbar */}
        <div className="space-x-4">
          {/* <button className="bg-[#098c83] hover:bg-[#07a193] transition text-white px-4 py-2 rounded-md font-semibold">
            Social Media
          </button>
          <button className="bg-[#098c83] hover:bg-[#07a193] transition text-white px-4 py-2 rounded-md font-semibold">
            Lihat Player
          </button> */}
        </div>
      </header>

      {/* SECTION: HERO */}
      <section className="pt-20 relative w-full overflow-hidden bg-transparent">
        {/* Background container */}
        <div className="w-full h-[70vh] md:h-[65vh] flex flex-col justify-center items-start transition-all duration-700 relative">
          {/* Overlay opsional untuk tambahan transparansi */}
          <div className="absolute inset-0 bg-transparent"></div>

          {/* Konten Hero */}
          <div className="relative z-10 px-6 md:px-16 lg:px-32 max-w-4xl">
            {/* Judul utama */}
            <h1
              className="
          text-5xl
          md:text-7xl
          font-extrabold
          mb-6
          tracking-wide
          uppercase
        "
              style={{
                WebkitTextStroke: `2px #098c83`, // Outline dengan warna main color
                color: "transparent", // Isi teks transparan
              }}
            >
              PRIME STATE
            </h1>

            {/* Deskripsi Hero */}
            <p className="text-lg md:text-xl text-[#098c83] mb-8 max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {/* Tombol CTA */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/list-player")}
                className="bg-[#098c83] hover:bg-[#07a193] transition text-white px-4 py-2 rounded-md font-semibold"
              >
                Status Player
              </button>
              <button className="bg-white hover:bg-[#f0f0f0] text-[#098c83] px-6 py-3 rounded-md font-semibold transition">
                Join the Server✈️
              </button>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h1
          className="
          text-center 
          text-5xl
          md:text-7xl
          font-extrabold
          mb-6
          tracking-wide
          uppercase
        "
          style={{
            WebkitTextStroke: `2px #098c83`, // Outline dengan warna main color
            color: "transparent", // Isi teks transparan
          }}
        >
          Galery
        </h1>
        <ImageCarousel images={images} currentIndex={currentIndex} />
      </div>

      {/* SECTION: QUICK LINKS */}
      <section className="py-12 px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://placehold.co/300x180.png?text=Rules"
              alt="Rules"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">
              Server Rules
            </h3>
            <p className="text-sm">Learn all the rules of our server.</p>
          </div>

          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://placehold.co/300x180.png?text=Forum"
              alt="Forum"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">Forum</h3>
            <p className="text-sm">Discuss with other players here.</p>
          </div>

          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://placehold.co/300x180.png?text=Donations"
              alt="Donations"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">Donations</h3>
            <p className="text-sm">Support our server with a donation.</p>
          </div>
        </div>
      </section>

      {/* SECTION: CLASSES / FACTIONS */}
      <section className="py-12 px-4 md:px-16">
        <h2 className="text-3xl text-center font-bold mb-10 text-[#ffffff]">
          Who Do You Want to Be?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://placehold.co/800x500.png"
              alt="Goverment"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Goverment
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://placehold.co/800x500.png"
              alt="Gangster"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Gangster
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>
        </div>

        {/* Optional second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://placehold.co/800x500.png"
              alt="Goverment"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Goverment
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://placehold.co/800x500.png"
              alt="Gangster"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Gangster
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FOOTER */}
      <footer className="bg-white py-4 text-center border-t border-[#ccc]">
        <p className="text-sm text-[#777]">
          &copy; 2024
          <span className="text-[#098c83] ml-1 font-bold">PRIME RP</span>. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
