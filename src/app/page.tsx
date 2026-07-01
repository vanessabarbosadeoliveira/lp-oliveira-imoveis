import styles from './page.module.css'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PainSection from '@/components/PainSection/PainSection'
import MethodSection from '@/components/MethodSection/MethodSection'
import CaseSection from '@/components/CaseSection/CaseSection'
import TestimonialsSection from '@/components/TestimonialsSection/TestimonialsSection'
import NumbersSection from '@/components/NumbersSection/NumbersSection'
import AboutSection from '@/components/AboutSection/AboutSection'
import CtaSection from '@/components/CtaSection/CtaSection'
import SiteFooter from '@/components/SiteFooter/SiteFooter'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <HeroSection />
        <PainSection />
        <MethodSection />
        <CaseSection />
        <TestimonialsSection />
        <NumbersSection />
        <AboutSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
