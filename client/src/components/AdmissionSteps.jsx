import { useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

// steps = [['Explore', 'Choose your program...'], ['Enquire', '...'], ...]
export default function AdmissionSteps({ steps = [] }) {
  const [active, setActive] = useState(0)
  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0

  return (
    <Wrap>
      <Track>
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ height: '100%', background: '#f21f1f', borderRadius: 4 }}
        />
      </Track>

      <Grid>
        {steps.map(([title, text], i) => (
          <Step key={title} onClick={() => setActive(i)}>
            <Node
              $done={i <= active}
              animate={{ scale: i === active ? 1.15 : 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {i < active ? '✓' : i + 1}
            </Node>
            <h4 style={{ color: i <= active ? '#111827' : '#6b7280' }}>{title}</h4>
            <p>{text}</p>
          </Step>
        ))}
      </Grid>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
`

/* grey base line: pehle node ke center se aakhri node ke center tak */
const Track = styled.div`
  position: absolute;
  top: 33px;
  left: 12.5%;
  right: 12.5%;
  height: 4px;
  background: #b9dde1;
  border-radius: 4px;
  transform: translateY(-50%);
  @media (max-width: 700px) {
    top: 22px;
  }
`

const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  h4 {
    margin: 12px 0 4px;
    font-size: 20px;
    font-weight: 700;
    transition: color 0.3s;
  }
  p {
    margin: 0;
    color: #6b7280;
    font-size: 15px;
    line-height: 1.5;
  }
  @media (max-width: 700px) {
    h4 { font-size: 14px; }
    p { font-size: 12px; }
  }
`

const Node = styled(motion.div)`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: ${(p) => (p.$done ? '#fff' : '#6b7280')};
  background: ${(p) => (p.$done ? '#f21f1f' : '#fff')};
  border: 3px solid ${(p) => (p.$done ? '#f21f1f' : '#b9dde1')};
  transition: background 0.3s, border-color 0.3s, color 0.3s;
  @media (max-width: 700px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
`