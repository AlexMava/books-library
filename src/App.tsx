import {BrowserRouter as Router, Route , Routes} from 'react-router-dom';

import './App.scss'

import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import BooksTable from "./components/booksTable/BooksTable.tsx";
import Page404 from "./pages/404.tsx";
import EditPage from "./pages/EditPage.tsx";

function App() {

  return (
    <Router>
        <Header />

        <main className='main-content'>

            <Routes>
                <Route path='/' element={<BooksTable />}/>
                <Route path='/edit' element={<EditPage/>}/>
                <Route path='/edit/:id' element={<EditPage/>}/>
                <Route path='*' element={<Page404/>}/>
            </Routes>

        </main>

        <Footer />
    </Router>
  )
}

export default App
