import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CustomerForm from "./components/CustomerForm";
import EditCustomer from "./pages/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CustomerForm />} />
        <Route path="/edit/:id" element={<EditCustomer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;