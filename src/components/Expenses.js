import React, { useState } from "react";
import styles from "./Expenses.module.css"; 

function Expenses({ companies, updateCompanies }) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [error, setError] = useState("");
  const [addCapitalAmount, setAddCapitalAmount] = useState("");
  const [capitalError, setCapitalError] = useState("");


  const handleAddCapital = () => {
    const companyIndex = companies.findIndex((c) => c.name === selectedCompany);
  
    if (companyIndex === -1) {
      setCapitalError("Selecione uma empresa válida.");
      return;
    }
  
    const additionalCapital = parseFloat(addCapitalAmount);
    if (isNaN(additionalCapital) || additionalCapital <= 0) {
      setCapitalError("Insira um valor válido para o capital adicional.");
      return;
    }
  
    const updatedCompanies = [...companies];
    updatedCompanies[companyIndex] = {
      ...companies[companyIndex],
      capital: parseFloat(companies[companyIndex].capital) + additionalCapital,
    };
  
    updateCompanies(updatedCompanies);
    setAddCapitalAmount("");
    setCapitalError("");
  };
  

  const handleExpense = () => {
    const companyIndex = companies.findIndex((c) => c.name === selectedCompany);

    if (companyIndex === -1) {
      setError("Selecione uma empresa válida.");
      return;
    }

    const selected = companies[companyIndex];
    const expense = parseFloat(expenseAmount);

    if (expense > parseFloat(selected.capital)) {
      setError("O valor do gasto excede o capital da empresa!");
    } else {
      // Criar a nova transação de gasto
      const newExpense = {
        description: expenseDescription,
        amount: expense,
      };

      const updatedCompany = {
        ...selected,
        capital: (parseFloat(selected.capital) - expense).toFixed(2),
        expenses: [...(selected.expenses || []), newExpense],
      };

      const updatedCompanies = [...companies];
      updatedCompanies[companyIndex] = updatedCompany;

      updateCompanies(updatedCompanies);

      setExpenseAmount("");
      setExpenseDescription("");
      setError("");
    }
  };

  return (
    <div className={styles.expenses} > {/* Usando o estilo do CSS module */}
      <h1>Controle de Gastos</h1>
      <div className={styles.expensesForm}> {/* Usando o estilo do CSS module */}
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
        <input
          type="number"
          placeholder="Valor do gasto"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição do gasto"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
        />
        <button onClick={handleExpense}>Registrar Gasto</button>
      </div>
      {error && <p className={styles.error}>{error}</p>} {/* Usando o estilo do CSS module */}
      
      <div className={styles.addCapitalForm}>
      <h2>Adicionar Capital</h2>
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
      <input
        type="number"
        placeholder="Valor adicional"
        value={addCapitalAmount}
        onChange={(e) => setAddCapitalAmount(e.target.value)}
      />
    </div>
    <div>
      <button onClick={handleAddCapital}>Adicionar Capital</button>
      {capitalError && <p className={styles.erroAcont}>{capitalError}</p>}
    </div>

      <div className={styles.expensesList}> {/* Usando o estilo do CSS module */}
        <h2>Empresas Atualizadas</h2>
        <ul>
          {companies.map((c, index) => (
            <li key={index}>
              <strong>{c.name}</strong> - Capital Atual: {c.capital}
              <ul>
                {c.expenses && c.expenses.length > 0 ? (
                  c.expenses.map((expense, idx) => (
                    <li key={idx}>
                      <strong>{expense.description}:</strong> R${expense.amount.toFixed(2)}
                    </li>
                  ))
                ) : (
                  <li>Nenhum gasto registrado.</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Expenses;
