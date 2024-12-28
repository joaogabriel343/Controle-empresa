import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Expenses from "./components/Expenses";

function App() {
  const [company, setCompany] = useState({
    name: "",
    fantasyName: "",
    creationDate: "",
    capital: "",
  });
  const [companies, setCompanies] = useState([]);
  const [ceo, setCeo] = useState({ name: "", position: "" });
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  };

  const addCompany = async () => {
    if (company.name.trim() !== "") {
      const validCapital = parseFloat(company.capital);
      const newCompany = {
        ...company,
        capital: isNaN(validCapital) || validCapital <= 0 ? 0 : validCapital,
      };

      try {
        await axios.post("http://localhost:5000/companies", newCompany);
        fetchCompanies(); 
        setCompany({
          name: "",
          fantasyName: "",
          creationDate: "",
          capital: "",
        });
      } catch (error) {
        console.error("Erro ao adicionar empresa:", error);
      }
    }
  };

  const deleteCompany = async (companyToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/companies/${companyToDelete.id}`);
      fetchCompanies(); 
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
    }
  };

  const addCeo = async () => {
    if (ceo.name.trim() !== "" && selectedCompany) {
      try {
        await axios.post("http://localhost:5000/ceos", {
          ...ceo,
          companyName: selectedCompany,
        });
        fetchCompanies(); 
        setCeo({ name: "", position: "" });
      } catch (error) {
        console.error("Erro ao adicionar CEO:", error);
      }
    }
  };

  const deleteCeo = async (companyName, ceoToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/ceos/${companyName}/${ceoToDelete.name}`);
      fetchCompanies(); 
    } catch (error) {
      console.error("Erro ao excluir CEO:", error);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleCeoChange = (e) => {
    const { name, value } = e.target;
    setCeo({ ...ceo, [name]: value });
  };

  return (
    <div className="App">
      <h1>Gerenciamento de Empresas e CEOs</h1>

      <div className="section">
        <h2>Cadastro de Empresas</h2>
        <div className="add-company">
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleCompanyChange}
            placeholder="Nome da Empresa"
          />
          <input
            type="text"
            name="fantasyName"
            value={company.fantasyName}
            onChange={handleCompanyChange}
            placeholder="Nome Fantasia"
          />
          <input
            type="date"
            name="creationDate"
            value={company.creationDate}
            onChange={handleCompanyChange}
          />
          <input
            type="number"
            name="capital"
            value={company.capital}
            onChange={(e) => setCompany({ ...company, capital: parseFloat(e.target.value) || "" })}
            placeholder="Capital"
          />
          <button onClick={addCompany}>Adicionar Empresa</button>
        </div>
        <div className="company-list">
          <h3 className="title-list">Empresas Cadastradas</h3>
          <ul>
            {companies.length > 0 ? (
              companies.map((c, index) => (
                <li key={index}>
                  <strong>{c.name}</strong> (Fantasia: {c.fantasyName}) - Criada em {c.creationDate} - Capital: {c.capital > 0 ? `R$ ${parseFloat(c.capital).toFixed(2)}` : "Empresa sem Capital"}
                  <button onClick={() => deleteCompany(c)}>Excluir</button>
                  <ul>
                    <h4>Funcionários:</h4>
                    {c.ceos.length > 0 ? (
                      c.ceos.map((ceo, idx) => (
                        <li key={idx}>
                          {ceo.name} - {ceo.position}
                          <button onClick={() => deleteCeo(c.name, ceo)}>Excluir {ceo.position}</button>
                        </li>
                      ))
                    ) : (
                      <li>Nenhum CEO cadastrado.</li>
                    )}
                  </ul>
                </li>
              ))
            ) : (
              <li>Nenhuma empresa cadastrada.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="section">
        <h2>Cadastro de CEOs</h2>
        <div className="add-ceo">
          <input
            type="text"
            name="name"
            value={ceo.name}
            onChange={handleCeoChange}
            placeholder="Nome do CEO"
          />
          <input
            type="text"
            name="position"
            value={ceo.position}
            onChange={handleCeoChange}
            placeholder="Cargo do CEO"
          />
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="">Selecione uma empresa</option>
            {companies.map((c, index) => (
              <option key={index} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button onClick={addCeo}>Adicionar CEO</button>
        </div>
      </div>
      <Expenses companies={companies} updateCompanies={setCompanies} />
    </div>
  );
}

export default App;
