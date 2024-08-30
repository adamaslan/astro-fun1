// src/components/App.jsx
import { useEffect, useState } from "react";
import { config } from 'dotenv';
import { createClient } from "@supabase/supabase-js";

config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function App() {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getCountries();
  }, []);

  // Function to fetch countries from Supabase
  async function getCountries() {
    try {
      const { data, error } = await supabase.from("countries").select();
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      setError("Error fetching countries");
      console.error(error);
    }
  }

  // Function to add a new country to Supabase
  async function addCountry(e) {
    e.preventDefault();
    if (!newCountry.trim()) return; // Prevent empty country names

    try {
      const { data, error } = await supabase.from("countries").insert([{ name: newCountry }]);
      if (error) throw error;
      setCountries([...countries, ...data]); // Add the new country to the list
      setNewCountry(""); // Clear the input
    } catch (error) {
      setError("Error adding country");
      console.error(error);
    }
  }

  return (
    <div>
      <h2>Countries List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {countries.map((country) => (
          <li key={country.id || country.name}>{country.name}</li>
        ))}
      </ul>

      {/* Form to add a new country */}
      <form onSubmit={addCountry} style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="Enter a country name"
          required
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add Country
        </button>
      </form>
    </div>
  );
}

export default App;
