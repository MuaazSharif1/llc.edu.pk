import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const Loader = () => (
  <StyledWrapper
    role="status"
    aria-label="Loading"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.45 }}
  >
    <img
      src="/logo.png"
      alt=""
      className="loader-logo"
      onError={(e) => { e.currentTarget.style.display = 'none' }}
    />
    <section className="dots-container">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </section>
  </StyledWrapper>
)

const StyledWrapper = styled(motion.div)`
  /* top/left/right/bottom (not "inset") so older iPhones also cover the full screen */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  z-index: 9999;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 24px;

  .loader-logo {
    height: clamp(56px, 16vw, 84px);
    width: auto;
    max-width: 70vw;
    object-fit: contain;
  }

  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(7px, 2vw, 10px);
  }

  .dot {
    height: clamp(13px, 3.8vw, 18px);
    width: clamp(13px, 3.8vw, 18px);
    border-radius: 50%;
    background-color: #f7b4b4;
    animation: llcPulse 1.5s infinite ease-in-out;
    will-change: transform;
  }

  .dot:nth-child(1) { animation-delay: -0.3s; }
  .dot:nth-child(2) { animation-delay: -0.15s; }
  .dot:nth-child(3) { animation-delay: 0s; }
  .dot:nth-child(4) { animation-delay: 0.15s; }
  .dot:nth-child(5) { animation-delay: 0.3s; }

  @keyframes llcPulse {
    0%   { transform: scale(0.8); background-color: #f7b4b4; }
    50%  { transform: scale(1.2); background-color: #ef2121; }
    100% { transform: scale(0.8); background-color: #f7b4b4; }
  }
`

export default Loader