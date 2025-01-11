import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // URL gambar saat ini
  const currentImage = images[currentIndex];

  // Fungsi untuk menutup overlay
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] text-[#333] overflow-auto relative">
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
              Kami masih menyempurnakan halaman ini. 
              Jika ingin memantau jumlah pemain online, silakan klik button List Player
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  navigate("/list-player");
                }}
                className="bg-[#098c83] hover:bg-[#07a193] text-white px-5 py-2 rounded-md font-semibold"
              >
                List Player
              </button>
              <button
                onClick={handleCloseOverlay}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md font-semibold"
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
        <div className="flex items-center space-x-3">
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
              font-extrabold uppercase text-[#098c83]
              transition-all duration-300
              ${isScrolled ? "text-lg" : "text-xl"}
            `}
          >
            PRIME STATE RP
          </span>
        </div>

        {/* Tombol Monitoring di Navbar */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/list-player")}
            className="bg-[#098c83] hover:bg-[#07a193] transition text-white px-4 py-2 rounded-md font-semibold"
          >
            Lihat Warga
          </button>
        </div>
      </header>

      {/* SECTION: HERO (SLIDESHOW) */}
      <section className="pt-20 relative w-full overflow-hidden">
        <div
          className="w-full h-[70vh] md:h-[80vh] bg-cover bg-center flex flex-col justify-center items-center transition-all duration-700 relative"
          style={{
            backgroundImage: `url(${currentImage})`,
          }}
        >
          {/* Overlay hero lebih terang */}
          <div className="absolute inset-0 bg-white/30 mix-blend-multiply"></div>

          {/* Konten Teks Hero */}
          <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
            <h1
              className="
                text-6xl
                md:text-8xl
                font-extrabold
                mb-4
                tracking-wide
              "
              style={{
                WebkitTextStroke: "2px #ffffff", // outline putih
                color: "transparent",            // isi teks transparan
              }}
            >
              #EVERYTHING WILL BE PRIME
            </h1>
          </div>
        </div>
      </section>

      {/* SECTION: QUICK LINKS */}
      <section className="py-12 px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://via.placeholder.com/300x180.png?text=Rules"
              alt="Rules"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">
              Server Rules
            </h3>
            <p className="text-sm">
              Learn all the rules of our server.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://via.placeholder.com/300x180.png?text=Forum"
              alt="Forum"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">
              Forum
            </h3>
            <p className="text-sm">
              Discuss with other players here.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg hover:shadow-xl transition-all border">
            <img
              src="https://via.placeholder.com/300x180.png?text=Donations"
              alt="Donations"
              className="mb-4 rounded-lg object-cover mx-auto"
            />
            <h3 className="text-xl font-bold mb-2 text-[#098c83]">
              Donations
            </h3>
            <p className="text-sm">
              Support our server with a donation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: CLASSES / FACTIONS */}
      <section className="py-12 px-4 md:px-16">
        <h2 className="text-3xl text-center font-bold mb-10 text-[#098c83]">
          Who Do You Want to Be?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://via.placeholder.com/800x500.png?text=Working+Class"
              alt="Working Class"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Working Class
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://via.placeholder.com/800x500.png?text=Los+Santos+Mafia"
              alt="Los Santos Mafia"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Los Santos Mafia
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
              src="https://via.placeholder.com/800x500.png?text=Working+Class"
              alt="Working Class"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Working Class
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg group">
            <img
              src="https://via.placeholder.com/800x500.png?text=Los+Santos+Mafia"
              alt="Los Santos Mafia"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-[#098c83]/30 flex flex-col justify-end p-4">
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Los Santos Mafia
              </h3>
              <p className="text-sm text-white drop-shadow">
                Lorem ipsum dolor sit amet consectetur. Senectus sit duis ac ut
                aliquet amet ultricies amet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FINAL CTA */}
      <section className="py-16 px-4 md:px-16 text-center relative bg-[#098c83] text-white">
        <img
          src="https://via.placeholder.com/1200x400.png?text=Roleplay+Illustration"
          alt="Roleplay Illustration"
          className="mx-auto mb-8 object-contain"
        />
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Start
        </h2>
        <h3 className="text-4xl md:text-5xl font-extrabold mb-8">
          Your New Life?
        </h3>
        <button className="bg-white hover:bg-[#f0f0f0] text-[#098c83] px-6 py-3 rounded-md font-semibold transition">
          Join the Server
        </button>
      </section>

      {/* SECTION: FOOTER */}
      <footer className="bg-white py-4 text-center border-t border-[#ccc]">
        <p className="text-sm text-[#777]">
          &copy; 2024
          <span className="text-[#098c83] ml-1 font-bold">Your Name</span>.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
