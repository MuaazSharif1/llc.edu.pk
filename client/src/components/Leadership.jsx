
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, MessageSquareText } from 'lucide-react'

// Edit names, designations, messages and images here.
// Images should be placed inside client/public/Leaders/
const LEADERS = [
  {
    id: 'principal',
    name: 'Syed Maruf Ahmadali',
    role: 'Principal, Lahore Law College',
    image: '/Leaders/principal.jpeg',
    btn: "View Principal's Message",
    title: "Principal's Message",

    message: [
      'We warmly welcome all the students joining Lahore Law College for the four-year law degree programme under the semester system.',

      'Law and order are the foundation of every progressive society. We are conscious of this fact and strive to make our students socially responsible and professionally excellent.',

      'The College aims to instil confidence in students so they can face social and professional challenges, uphold the law, advocate for the people of our country, and fight for justice for both the rich and the poor.',

      'Our students will gain the prescribed knowledge required to meet the academic requirements for admission to legal practice. Our dedicated and experienced faculty will guide them in both curricular and extracurricular activities.',

      'In addition to regular faculty, lectures by eminent jurists will be arranged to inspire and guide students. Our well-equipped library, containing textbooks and journals, will help students enhance their academic skills.',

      'Students will also gain practical legal experience by participating in moot courts, mock trials, legal quizzes, and the free legal aid clinic.',

      'I assure you of my full support and cordially welcome you to Lahore Law College.'
    ]
  },

  {
    id: 'chairman',
    name: 'Mian Muhammad Ayub (Late)',
    role: 'Chairman, Lahore Law College',
    image: '/Leaders/chairman.jpeg',
    btn: "View Chairman's Message",
    title: "Chairman's Message",

    message:  [
  'It gives me immense pleasure to welcome you to Lahore Law College, an institution committed to excellence in legal education and the development of future legal professionals.',

  'Education is not merely about acquiring knowledge; it is about building character, developing integrity, and creating a sense of responsibility towards society. The study of law provides students with the opportunity to understand justice, protect human rights, and contribute positively to the nation.',

  'Our vision has always been to provide quality legal education in an environment that encourages intellectual growth, critical thinking, discipline, and professional ethics.',

  'We believe that every student has the potential to become a responsible lawyer, a fair-minded leader, and a valuable member of society. Our institution strives to equip students with the knowledge, confidence, and skills required to meet the challenges of the legal profession.',

  'I encourage all students to pursue their academic journey with dedication, honesty, and determination. Always remember that the true strength of a lawyer lies not only in knowledge of the law but also in integrity, courage, and commitment to justice.',

  'May Lahore Law College continue to inspire generations of legal professionals who serve humanity and uphold the principles of justice and equality.'
]
  }
]

function FlipCard({ p, on, setOn }) {
  return (
    <motion.div
      id={p.id}
      className={'flip' + (on ? ' on' : '')}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flip-in">

        {/* Front Side */}
        <div className="face front" aria-hidden={on}>
          <div className="ph">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <div className="meta">
            <h3>{p.name}</h3>
            <p>{p.role}</p>
          </div>

          <button
            className="btn p"
            type="button"
            tabIndex={on ? -1 : 0}
            onClick={() => setOn(true)}
          >
            {p.btn}
            <MessageSquareText size={18} />
          </button>
        </div>

        {/* Back Side: Message */}
        <div className="face back" aria-hidden={!on}>
          <p className="eyebrow">{p.title}</p>

          <div className="msg">
            {p.message.map((m, i) => (
              <p key={i}>{m}</p>
            ))}
          </div>

          <div className="sign">
            <b>{p.name}</b>
            <span>{p.role}</span>
          </div>

          <button
            className="btn o"
            type="button"
            tabIndex={on ? 0 : -1}
            onClick={() => setOn(false)}
          >
            <RotateCcw size={16} />
            Back
          </button>
        </div>

      </div>
    </motion.div>
  )
}

export default function Leadership() {
  const { hash } = useLocation()
  const [open, setOpen] = useState({})

  // Open the relevant card when a footer link is clicked.
  // Examples: /#principal and /#chairman
  useEffect(() => {
    const id = hash.slice(1)

    if (LEADERS.some((leader) => leader.id === id)) {
      setOpen((prev) => ({
        ...prev,
        [id]: true
      }))
    }
  }, [hash])

  return (
    <section id="leadership" className="alt">
      <div className="wrap">

        <p className="eyebrow">Leadership</p>

        <h2>Messages from our leadership</h2>

        <p className="lead">
          Words of guidance from the people who lead Lahore Law College.
        </p>

        <div className="leaders">
          {LEADERS.map((p) => (
            <FlipCard
              key={p.id}
              p={p}
              on={!!open[p.id]}
              setOn={(value) =>
                setOpen((prev) => ({
                  ...prev,
                  [p.id]: value
                }))
              }
            />
          ))}
        </div>

      </div>
    </section>
  )
}
