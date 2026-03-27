import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import { AppRouter } from './router/AppRouter.jsx'

function App() {

  return (
    <div 
      className="w-full h-screen flex flex-col overflow-hidden bg-[#030712]"
      style={{
        backgroundImage: `
          radial-gradient(circle at -10% 10%, rgba(37, 99, 235, 0.35) 0%, transparent 40%),
          radial-gradient(circle at 110% 90%, rgba(37, 99, 235, 0.35) 0%, transparent 40%)
        `
      }}
    >
      <Header></Header>
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">
          <AppRouter />
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}

export default App
