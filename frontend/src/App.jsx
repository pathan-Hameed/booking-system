import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Book from "./pages/Book";
import BookingSuccess from "./pages/BookingSuccess";
import Contact from "./pages/Contact";
import Layout from "./Layout/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<Book />} />
        <Route path="/bookingSuccess" element={<BookingSuccess />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}