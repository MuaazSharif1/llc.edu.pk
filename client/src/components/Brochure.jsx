
import { motion } from 'framer-motion'
import { Download, Eye } from 'lucide-react'

// PDF file location inside public folder
export const BROCHURE = '/brochure/Lahore-Law-College-Admissions.pdf'

export default function Brochure() {
  return (
    <section id="brochure">
      <div className="wrap">

        <motion.div
          className="brochure"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >

          <a
            className="bro-cover"
            href={BROCHURE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View brochure"
          >
            <img
              src="/brochure/Lahore-Law-College-Admissions.png"
              alt="Lahore Law College Admissions"
              loading="lazy"
            />
          </a>

          <div>
            <p className="eyebrow">Brochure</p>

            <h2>Download our brochure</h2>

            <p className="lead">
              Programs, admissions information and college details,
              all in one PDF.
            </p>

            <div className="cta">

              {/* Download PDF */}
              <a
                className="btn p"
                href={BROCHURE}
                download="Lahore-Law-College-Admission.pdf"
              >
                <Download size={18} />
                Download Brochure
              </a>

              {/* View PDF Online */}
              <a
                className="btn o"
                href={BROCHURE}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye size={18} />
                View Online
              </a>

            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
