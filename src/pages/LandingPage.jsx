import { Link } from 'react-router-dom';
import { Eye, Smartphone, MonitorCheck, ShieldAlert, Timer, KeyRound, ArrowRight } from 'lucide-react';
import GradientHero from '../components/layout/GradientHero';
import Section from '../components/layout/Section';
import Eyebrow from '../components/ui/Eyebrow';
import LinkButton from '../components/ui/LinkButton';
import styles from './LandingPage.module.css';

const steps = [
  {
    n: '01',
    title: 'Build the exam on the web',
    body: 'Professors write questions, set a time limit and passing score, and schedule when the exam opens — all from the BantayEx dashboard.',
    icon: MonitorCheck,
  },
  {
    n: '02',
    title: 'Share the 6-character code',
    body: 'Every exam gets a short code like DS467D. Students enter it in the app to load the right exam — no rosters, no links.',
    icon: KeyRound,
  },
  {
    n: '03',
    title: 'The app watches while they work',
    body: "On-device computer vision tracks the student's gaze and flags violations the moment focus leaves the screen — all on the phone, in real time.",
    icon: Eye,
  },
  {
    n: '04',
    title: 'Results land instantly',
    body: "Scores, pass/fail status, and a full violation log appear on the professor's dashboard the second the exam is submitted.",
    icon: Timer,
  },
];

const appFeatures = [
  {
    icon: Eye,
    title: 'Gaze-based proctoring',
    body: "MediaPipe-powered face and eye tracking runs locally on the student's phone — if their eyes leave the screen, it's logged.",
  },
  {
    icon: ShieldAlert,
    title: 'Violation logging',
    body: 'Looking away, switching apps, or losing camera focus counts as a violation. Repeated violations can auto-submit the exam.',
  },
  {
    icon: Timer,
    title: 'Timed, auto-submitted exams',
    body: 'A visible countdown keeps students on pace, and the exam submits itself the moment time runs out.',
  },
  {
    icon: KeyRound,
    title: 'Code-based entry',
    body: 'No accounts needed for students — just a name and the exam code their professor shares.',
  },
];

const LandingPage = () => {
  return (
    <>
      <GradientHero>
        <p className={styles.eyebrowDot}>
          <span className={styles.dot} />
          Vision-based proctoring
        </p>
        <h2 className={styles.heroTitle}>
          Exams that
          <br />
          watch themselves.
        </h2>
        <p className={styles.heroBody}>
          BantayEx pairs a simple web dashboard for professors with a mobile app that uses
          on-device computer vision to track a student's gaze and keep them honest — no human
          proctor required.
        </p>
        <div className={styles.heroActions}>
          <LinkButton href="#download" variant="light" size="lg" uppercase>
            <Smartphone size={16} />
            Download the app
          </LinkButton>
          <Link to="/register" className={styles.secondaryCta}>
            Create an exam
            <ArrowRight size={15} />
          </Link>
        </div>
      </GradientHero>

      <Section>
        <Eyebrow light>How it works</Eyebrow>
        <h3 className={styles.sectionTitle}>From dashboard to graded, in four steps.</h3>

        <div className={styles.grid}>
          {steps.map((step) => (
            <div key={step.n} className={styles.row}>
              <span className={styles.stepNumber}>{step.n}</span>
              <div>
                <div className={styles.itemHeading}>
                  <step.icon size={15} className={styles.iconAccent} />
                  <h4 className={styles.itemTitle}>{step.title}</h4>
                </div>
                <p className={styles.itemBody}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className={styles.featuresHead}>
          <div>
            <Eyebrow light>The student app</Eyebrow>
            <h3 className={styles.sectionTitle}>
              The proctoring happens
              <br className={styles.breakDesktop} /> on their phone, not yours.
            </h3>
          </div>
          <p className={styles.featuresHeadNote}>
            Students never need a BantayEx account — they install the app, enter the exam code
            their professor gives them, and the camera does the rest.
          </p>
        </div>

        <div className={styles.grid}>
          {appFeatures.map((f) => (
            <div key={f.title} className={styles.row}>
              <div className={styles.iconBox}>
                <f.icon size={18} className={styles.iconBoxIcon} />
              </div>
              <div>
                <h4 className={styles.itemTitleTight}>{f.title}</h4>
                <p className={styles.itemBody}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="download">
        <div className={styles.downloadCard}>
          <div className={styles.downloadInner}>
            <Eyebrow>Get started</Eyebrow>
            <h3 className={styles.downloadTitle}>Get the BantayEx app</h3>
            <p className={styles.downloadBody}>
              Enter your exam code, look at the screen, and get your result the moment you
              submit. Currently available for Android as a direct download.
            </p>
            <div className={styles.downloadActions}>
              <LinkButton
                href="https://github.com/TocongR/bantayex_mobile/releases/download/v1.0.0/bantayex.apk"
                download
                variant="light"
                size="lg"
              >
                <Smartphone size={18} />
                Download APK for Android
              </LinkButton>
            </div>
            <p className={styles.downloadNote}>You can install the app right here on this page.</p>
          </div>
        </div>
      </Section>

      <Section divider={false}>
        <div className={styles.ctaRow}>
          <div>
            <Eyebrow light>For professors</Eyebrow>
            <h3 className={styles.ctaTitle}>Built for the classroom.</h3>
            <p className={styles.ctaBody}>
              Create exams, generate codes, and review every student's score and violation
              history — all from your browser.
            </p>
          </div>
          <LinkButton to="/register" size="lg" uppercase className={styles.ctaButtonShrink}>
            Create your first exam
            <ArrowRight size={15} />
          </LinkButton>
        </div>
      </Section>
    </>
  );
};

export default LandingPage;