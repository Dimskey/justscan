import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollVelocity from '../components/ScrollVelocity'
import SpotlightCard from '../components/SpotlightCard'
import LetterGlitch from '../components/LetterGlitch'
import GradientText from '../components/GradientText'
import ShinyText from '../components/ShinyText'

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      {/* LetterGlitch Background for entire page */}
      <div className="fixed inset-0 z-0">
        <LetterGlitch 
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>
      
      <div className="relative z-10 layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_330)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_330"><rect width="48" height="48" fill="white"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">JustScan</h2>
          </div>
          <Link to="/dashboard">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2b4539] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-[#3d5e49] hover:scale-105 hover:shadow-lg hover:shadow-[#2b4539]/30 active:scale-95">
              <span className="truncate">Mulai Sekarang</span>
            </button>
          </Link>
        </header>
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section Content */}
            <div className="@container mb-20">
              <div className="@[480px]:p-4">
                <div className="flex flex-col gap-6 @[480px]:gap-8 @[480px]:rounded-xl items-start justify-center px-4 py-20 @[480px]:px-10">
                  <div className="flex flex-col gap-2 text-left">
                    <GradientText 
                      className="text-4xl @[480px]:text-5xl font-black @[480px]:font-black leading-tight tracking-[-0.033em] @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                      colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                      animationSpeed={3}
                    >
                      Empowering Ethical Hackers & Pentesters
                    </GradientText>
                    <h2 className="text-white text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed">
                      JustScan adalah platform web-based yang menyederhanakan proses network reconnaissance dan vulnerability assessment. Dengan integrasi AI analysis dari IBM Granite, JustScan membantu security professionals melakukan scanning, analisis, dan dokumentasi secara sistematis dalam satu dashboard yang terintegrasi.
                    </h2>
                  </div>
                  <Link to="/dashboard">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#2b4539] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-all duration-300 hover:bg-[#3d5e49] hover:scale-105 hover:shadow-lg hover:shadow-[#2b4539]/30 active:scale-95">
                      <span className="truncate">➡️ Mulai Sekarang</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {/* ScrollVelocity Effect hanya pada judul FITUR UTAMA */}
                  <ScrollVelocity
                    texts={["FITUR UTAMA"]}
                    className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                    velocity={30}
                    parallaxClassName="py-4"
                    scrollerClassName="text-2xl md:text-4xl lg:text-6xl font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <SpotlightCard className="rounded-lg border border-[#3b4754] bg-[#1c2127] p-4 flex flex-1 flex-col gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#61dca3]/20">
                  <div className="text-white" data-icon="Tools" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56l160,0Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">🔍 Network & Web Scanning</h2>
                    <p className="text-[#9daab9] text-sm font-normal leading-normal">
                      Integrated Nmap untuk port scanning dan WhatWeb untuk web application fingerprinting dalam satu interface.
                    </p>
                  </div>
                </SpotlightCard>
                <SpotlightCard className="rounded-lg border border-[#3b4754] bg-[#1c2127] p-4 flex flex-1 flex-col gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#61dca3]/20">
                  <div className="text-white" data-icon="Brain" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M160,16A80.07,80.07,0,0,0,83.91,120.78L26.34,178.34A8,8,0,0,0,24,184v40a8,8,0,0,0,8,8H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A80,80,0,1,0,160,16Zm0,144a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A64,64,0,1,1,160,160Zm32-84a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">🧠 AI-Powered Analysis</h2>
                    <p className="text-[#9daab9] text-sm font-normal leading-normal">IBM Granite AI menganalisis hasil scan dan memberikan vulnerability assessment dengan severity rating dan remediation steps.</p>
                  </div>
                </SpotlightCard>
                <SpotlightCard className="rounded-lg border border-[#3b4754] bg-[#1c2127] p-4 flex flex-1 flex-col gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#61dca3]/20">
                  <div className="text-white" data-icon="Lock" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">📊 Project Management</h2>
                    <p className="text-[#9daab9] text-sm font-normal leading-normal">Kelola multiple security assessments dengan project dashboard, metrics tracking, dan centralized documentation.</p>
                  </div>
                </SpotlightCard>
                <SpotlightCard className="rounded-lg border border-[#3b4754] bg-[#1c2127] p-4 flex flex-1 flex-col gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#61dca3]/20">
                  <div className="text-white" data-icon="Book" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,24H72A16,16,0,0,0,56,40V56H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H56v16a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V40A16,16,0,0,0,208,24ZM72,40H192V192H72V40ZM40,72H56V200H40ZM208,208H72V200H208v8Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-base font-bold leading-tight">📝 Documentation & Notes</h2>
                    <p className="text-[#9daab9] text-sm font-normal leading-normal">Built-in note system untuk mendokumentasikan findings, metodologi, dan hasil assessment dalam format yang terstruktur.</p>
                  </div>
                </SpotlightCard>
              </div>
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <GradientText 
                    className="tracking-light text-[32px] font-bold @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] mx-auto"
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                  >
                    🚀 Siap Meningkatkan Workflow Ethical Hacking Anda?
                  </GradientText>
                  <p className="text-lg font-normal leading-relaxed max-w-[720px] mx-auto @[480px]:text-xl">
                    <ShinyText text="Mulai scanning dan vulnerability assessment dengan JustScan — platform yang mengintegrasikan tools reconnaissance dan AI analysis dalam satu dashboard." speed={4} />
                  </p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <Link to="/dashboard">
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#2b4539] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow transition-all duration-300 hover:bg-[#3d5e49] hover:scale-105 hover:shadow-lg hover:shadow-[#2b4539]/30 active:scale-95 hover:shadow-xl">
                        <span className="truncate transition-all duration-300 hover:translate-x-1">➡️ Mulai Sekarang</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#9daab9] text-base font-normal leading-normal min-w-40 transition-colors duration-300 hover:text-white" href="#">Contact Us</a>
                <a className="text-[#9daab9] text-base font-normal leading-normal min-w-40 transition-colors duration-300 hover:text-white" href="#">Privacy Policy</a>
                <a className="text-[#9daab9] text-base font-normal leading-normal min-w-40 transition-colors duration-300 hover:text-white" href="#">Terms of Service</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#" className="transition-transform duration-300 hover:scale-110">
                  <div className="text-[#9daab9]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
                    </svg>
                  </div>
                </a>
                <a href="#" className="transition-transform duration-300 hover:scale-110">
                  <div className="text-[#9daab9]" data-icon="LinkedinLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                    </svg>
                  </div>
                </a>
              </div>
              <p className="text-[#9daab9] text-base font-normal leading-normal">© 2024 JustScan. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage 