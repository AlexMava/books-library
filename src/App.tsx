import './App.scss'

import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import BooksTable from "./components/booksTable/BooksTable.tsx";

function App() {

  return (
    <>
        <Header />

        <main className='main-content'>
            <BooksTable />
        </main>

        <Footer />
    </>
  )
}

export default App
