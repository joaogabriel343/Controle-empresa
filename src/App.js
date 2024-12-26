import React, { useState } from "react";
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

  const addCompany = () => {
    if (company.name.trim() !== "") {
      setCompanies([...companies, { ...company, ceos: [], capital: parseFloat(company.capital) }]);
      setCompany({
        name: "",
        fantasyName: "",
        creationDate: "",
        capital: "",
      });
    }
  };

  const deleteCompany = (companyToDelete) => {
    setCompanies(companies.filter((c) => c !== companyToDelete));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const addCeo = () => {
    if (ceo.name.trim() !== "" && selectedCompany) {
      setCompanies(
        companies.map((c) => {
          if (c.name === selectedCompany) {
            return { ...c, ceos: [...c.ceos, ceo] };
          }
          return c;
        })
      );
      setCeo({ name: "", position: "" });
    }
  };

  const deleteCeo = (companyName, ceoToDelete) => {
    setCompanies(
      companies.map((c) => {
        if (c.name === companyName) {
          return { ...c, ceos: c.ceos.filter((ceo) => ceo !== ceoToDelete) };
        }
        return c;
      })
    );
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
            onChange={handleCompanyChange}
            placeholder="Capital"
          />
          <button onClick={addCompany}>Adicionar Empresa</button>
        </div>

        <div className="company-list">
          <h3>Empresas Cadastradas</h3>
          <ul>
            {companies.length > 0 ? (
              companies.map((c, index) => (
                <li key={index}>
                  <strong>{c.name}</strong> (Fantasia: {c.fantasyName}) - Criada em {c.creationDate}  
                  - Capital: {c.capital}
                  <button onClick={() => deleteCompany(c)}>Excluir</button>
                  <ul>
                    <h4>CEOs:</h4>
                    {c.ceos.length > 0 ? (
                      c.ceos.map((ceo, idx) => (
                        <li key={idx}>
                          {ceo.name} - {ceo.position}
                          <button
                            onClick={() => deleteCeo(c.name, ceo)}
                          >
                            Excluir CEO
                          </button>
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
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Selecione uma empresa</option>
            {companies.map((c, index) => (
              <option key={index} value={c.name}>
                {c.name}
              </option>
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