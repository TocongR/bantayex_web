import { Eye, GraduationCap } from 'lucide-react';
import GradientHero from '../components/layout/GradientHero';
import Section from '../components/layout/Section';
import Eyebrow from '../components/ui/Eyebrow';
import styles from './AboutPage.module.css';

const team = [
  { name: 'Ralphjan Tocong', role: 'Project Lead & Full-Stack Development' },
  { name: 'Philip Asenjo', role: 'Mobile App Development' },
  { name: 'Keziah Parpa', role: 'Computer Vision & Research' },
  { name: 'Remigene Mylez Fuentes', role: 'UI/UX & Documentation' },
];

const AboutPage = () => {
  return (
    <>
      <GradientHero padding="md">
        <p className={styles.eyebrowDot}>
          <GraduationCap size={14} className={styles.iconAccent} />
          Thesis project
        </p>
        <h2 className={styles.heroTitle}>
          BantayEx is a thesis project — built to make exam integrity less about watching, and
          more about trust backed by technology.
        </h2>
        <p className={styles.heroBody}>
          The system pairs a lightweight web dashboard, where professors build and manage
          exams, with a mobile app that uses on-device computer vision to keep watch over a
          student's gaze during the exam. It's being developed and researched by the team
          below.
        </p>
      </GradientHero>

      <Section compact>
        <Eyebrow light>The team</Eyebrow>
        <h3 className={styles.sectionTitle}>Who's building this.</h3>

        <div className={styles.grid}>
          {team.map((member) => (
            <div key={member.name} className={styles.row}>
              <div className={styles.avatar}>
                {member.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <h4 className={styles.memberName}>{member.name}</h4>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section compact divider={false}>
        <div className={styles.note}>
          <Eye size={20} className={styles.noteIcon} />
          <p className={styles.noteText}>
            BantayEx — from the Filipino word <span className={styles.noteEmphasis}>"bantay,"</span>{' '}
            meaning to watch over or guard. The name reflects the project's goal: a quiet,
            automated proctor that lets professors focus on teaching, not policing.
          </p>
        </div>
      </Section>
    </>
  );
};

export default AboutPage;