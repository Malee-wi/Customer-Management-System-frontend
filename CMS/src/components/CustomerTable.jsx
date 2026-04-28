import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { useNavigate } from "react-router-dom";
import "../css/CustomerTable.css";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      console.log("Loaded customers:", res.data);
      setCustomers(res.data.content || res.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };


  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nic?.includes(searchTerm)
  );

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customer-table-container">
      <div className="table-header">
        
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or NIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={() => navigate("/create")} className="add-btn">
          + Add New Customer
        </button>
      </div>

      <div className="table-responsive">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>DOB</th>
              <th>Mobile Numbers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name || "-"}</td>
                  <td>{customer.nic || "-"}</td>
                  <td>{customer.dob || "-"}</td>
                  <td className="mobile-numbers-cell">
                    {customer.mobileNumbers && customer.mobileNumbers.length > 0 ? (
                      <ul className="mobile-list">
                        {customer.mobileNumbers.map((m, i) => (
                          <li key={i}>{m.number || m}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                 
                  <td>
                    <button
                      onClick={() => navigate(`/edit/${customer.id}`)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}