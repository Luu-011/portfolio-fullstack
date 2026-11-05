import Hero from '../../components/home/Hero'
import About from '../../components/home/About'
import Stack from '../../components/home/Stack'
import Services from '../../components/home/Services'
import ProjectsPreview from '../../components/projects/ProjectsPreview'
import Experience from '../../components/home/Experience'
import ContactSection from '../../components/contact/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stack />
      <Services />
      <ProjectsPreview />
      <Experience />
      <ContactSection />
    </>
  )
}
