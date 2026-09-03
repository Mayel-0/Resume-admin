import React from 'react'
import Header from '../components/header'
import Hero from '../components/hero'
import About from '../components/about'
import Parcours from '../components/parcours'
import Skills from '../components/skills'
import Projects from '../components/projects'
import Contacts from '../components/contacts'

import Footer from '../components/footer'

function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <About />
        <Parcours />
        <Skills />
        <Projects />
        <Contacts/>
        <Footer/>
      </main>
    </div>
  )
}

export default HomePage
