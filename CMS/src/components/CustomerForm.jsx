import { useState, useEffect } from "react";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from "../services/customerService";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CustomerForm.css";

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
  const [customer, setCustomer] = useState({
    name: "",
    dob: "",
    nic: "",
    mobileNumbers: [{ number: "" }],
    addresses: [{ line1: "", line2: "", city: "", country: "" }],
  });

 
  const normalizeMobileNumbers = (mobileData = []) => {
  const result = mobileData
    .map(item => {
      if (typeof item === "string" || typeof item === "number") {
        return { number: String(item) };
      }

      return {
        number:
          item?.number ||
          item?.mobileNumber ||
          item?.value ||
          ""
      };
    })
    .filter(item => item.number.trim());

  return result.length ? result : [{ number: "" }];
};

const normalizeAddresses = (addressData = []) => {
  const result = addressData
    .map(item => ({
      line1: item?.line1 || item?.addressLine1 || item?.street || "",
      line2: item?.line2 || item?.addressLine2 || item?.apartment || "",
      city: item?.city || "",
      country: item?.country || ""
    }))
    .filter(item =>
      item.line1.trim() &&
      item.city.trim() &&
      item.country.trim()
    );

  return result.length
    ? result
    : [{ line1: "", line2: "", city: "", country: "" }];
};

  
  useEffect(() => {
    if (id) {
      setLoading(true);
      getCustomerById(id)
        .then((res) => {
          const customerData = res.data;
          console.log("Raw customer data from backend:", customerData);
          
          
          let mobileNumbers = [];
          if (customerData.mobileNumbers) {
            mobileNumbers = customerData.mobileNumbers;
          } 
          
          
          const normalizedMobiles = normalizeMobileNumbers(mobileNumbers);
          
          
          let addresses = [];
          if (customerData.addresses) {
            addresses = customerData.addresses;
          } 
          
          
          const normalizedAddresses = normalizeAddresses(addresses);
          
         
          setCustomer({
            name: customerData.name || customerData.fullName || "",
            dob: customerData.dob || customerData.dateOfBirth || "",
            nic: customerData.nic || customerData.nicNumber || "",
            mobileNumbers: normalizedMobiles,
            addresses: normalizedAddresses,
          });
          
          console.log("Set customer state:", {
            name: customerData.name,
            nic: customerData.nic,
            mobileNumbers: normalizedMobiles,
            addresses: normalizedAddresses,
          });
        })
        .catch((error) => {
          console.error("Error loading customer:", error);
          alert("Failed to load customer data. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  
  const addMobile = () => {
    setCustomer({
      ...customer,
      mobileNumbers: [...customer.mobileNumbers, { number: "" }],
    });
  };

  const removeMobile = (index) => {
    const updated = [...customer.mobileNumbers];
    updated.splice(index, 1);
    if (updated.length === 0) {
      updated.push({ number: "" });
    }
    setCustomer({ ...customer, mobileNumbers: updated });
  };

  const handleMobileChange = (index, value) => {
    const updated = [...customer.mobileNumbers];
    updated[index] = { number: value };
    setCustomer({ ...customer, mobileNumbers: updated });
  };

 
  const addAddress = () => {
    setCustomer({
      ...customer,
      addresses: [
        ...customer.addresses,
        { line1: "", line2: "", city: "", country: "" },
      ],
    });
  };

  const removeAddress = (index) => {
    const updated = [...customer.addresses];
    updated.splice(index, 1);
    if (updated.length === 0) {
      updated.push({ line1: "", line2: "", city: "", country: "" });
    }
    setCustomer({ ...customer, addresses: updated });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...customer.addresses];
    updated[index] = { ...updated[index], [field]: value };
    setCustomer({ ...customer, addresses: updated });
  };

  
  const validateForm = () => {
    const newErrors = {};
    
    if (!customer.name || !customer.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!customer.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    if (!customer.nic || !customer.nic.trim()) {
      newErrors.nic = "NIC is required";
    }
    
    
    const validMobiles = customer.mobileNumbers.filter(m => {
      return m && m.number && typeof m.number === 'string' && m.number.trim();
    });
    
    if (validMobiles.length === 0) {
      newErrors.mobileNumbers = "At least one mobile number is required";
    }
    
    
    const validAddresses = customer.addresses.filter(a => {
      return a && 
             a.line1 && typeof a.line1 === 'string' && a.line1.trim() && 
             a.city && typeof a.city === 'string' && a.city.trim() && 
             a.country && typeof a.country === 'string' && a.country.trim();
    });
    
    if (validAddresses.length === 0) {
      newErrors.addresses = "At least one complete address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    
    const payload = {
      name: customer.name ? customer.name.trim() : "",
      dob: customer.dob || "",
      nic: customer.nic ? customer.nic.trim() : "",
      mobileNumbers: customer.mobileNumbers
        .filter(m => m && m.number && typeof m.number === 'string' && m.number.trim())
        .map(m => ({ number: m.number.trim() })),
      addresses: customer.addresses
        .filter(a => {
          return a && 
                 a.line1 && typeof a.line1 === 'string' && a.line1.trim() && 
                 a.city && typeof a.city === 'string' && a.city.trim() && 
                 a.country && typeof a.country === 'string' && a.country.trim();
        })
        .map(a => ({
          line1: a.line1.trim(),
          line2: a.line2 ? a.line2.trim() : "",
          city: a.city.trim(),
          country: a.country.trim()
        })),
    };
    
    console.log("Submitting payload:", JSON.stringify(payload, null, 2));
    
    try {
      if (id) {
        await updateCustomer(id, payload);
        alert("Customer updated successfully!");
      } else {
        await createCustomer(payload);
        alert("Customer created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving customer:", error);
      alert(error.response?.data?.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      navigate("/");
    }
  };

  if (loading && id) {
    return <div className="loading">Loading customer data...</div>;
  }

  return (
    <div className="customer-form-container">
      <div className="form-card">
        <h2>{id ? "Edit Customer" : "Create New Customer"}</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={customer.name || ""}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                disabled={loading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={customer.dob || ""}
                onChange={handleChange}
                className={errors.dob ? "error" : ""}
                disabled={loading}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>
            
            <div className="form-group">
              <label>NIC Number *</label>
              <input
                type="text"
                name="nic"
                placeholder="Enter NIC number"
                value={customer.nic || ""}
                onChange={handleChange}
                disabled={loading || !!id}
                className={errors.nic ? "error" : ""}
              />
              {errors.nic && <span className="error-text">{errors.nic}</span>}
              {id && <small className="hint">NIC cannot be changed after creation</small>}
            </div>
          </div>

          {/* Mobile Numbers Section */}
          <div className="form-section">
            <h3>Mobile Numbers</h3>
            {errors.mobileNumbers && (
              <div className="error-message">{errors.mobileNumbers}</div>
            )}
            
            {customer.mobileNumbers.map((mobile, index) => (
              <div key={index} className="array-item">
                <input
                  type="tel"
                  placeholder="Mobile number (e.g., 0712345678)"
                  value={mobile?.number || ""}
                  onChange={(e) => handleMobileChange(index, e.target.value)}
                  disabled={loading}
                />
                {customer.mobileNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMobile(index)}
                    className="remove-btn"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMobile}
              className="add-btn"
              disabled={loading}
            >
              + Add Mobile Number
            </button>
          </div>

          {/* Addresses Section */}
          <div className="form-section">
            <h3>Addresses</h3>
            {errors.addresses && (
              <div className="error-message">{errors.addresses}</div>
            )}
            
            {customer.addresses.map((address, index) => (
              <div key={index} className="address-card">
                <div className="address-header">
                  <h4>Address {index + 1}</h4>
                  {customer.addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="remove-btn"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    value={address?.line1 || ""}
                    onChange={(e) => handleAddressChange(index, "line1", e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={address?.line2 || ""}
                    onChange={(e) => handleAddressChange(index, "line2", e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={address?.city || ""}
                      onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={address?.country || ""}
                      onChange={(e) => handleAddressChange(index, "country", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAddress}
              className="add-btn"
              disabled={loading}
            >
              + Add Address
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Saving..." : (id ? "Update Customer" : "Create Customer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}