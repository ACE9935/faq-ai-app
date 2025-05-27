import { useState } from 'react'
import './App.css'
import IntroHeading from './tool-components/IntroHeading'
import FAQGenerator from './tool-components/FAQGenerator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <header>

    </header>
    <main className='w-full flex flex-col gap-10 items-center max-w-[75rem]'>
     <IntroHeading/>
     <FAQGenerator/>
    </main>
    <footer>

    </footer>
    </>
  )
}

export default App
