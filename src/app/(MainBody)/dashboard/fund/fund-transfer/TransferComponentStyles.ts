import styled from "styled-components";

export const TransferContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: ${({ theme }) => (theme === "dark" ? "#262932" : "#ffffff")};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

export const TransferForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
`;

export const WalletSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const WalletSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => (theme === "dark" ? "#e0e0e0" : "#333")};
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#444" : "#ccc")};
  border-radius: 8px;
  background: ${({ theme }) => (theme === "dark" ? "#262932" : "#f9f9f9")};
  color: ${({ theme }) => (theme === "dark" ? "#e0e0e0" : "#333")};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;

  &:focus {
    border-color: #007bff;
  }
`;

export const AmountInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#444" : "#ccc")};
  border-radius: 8px;
  background: ${({ theme }) => (theme === "dark" ? "#262932" : "#f9f9f9")};
  color: ${({ theme }) => (theme === "dark" ? "#e0e0e0" : "#333")};
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }
`;

export const UsernameInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#444" : "#ccc")};
  border-radius: 8px;
  background: ${({ theme }) => (theme === "dark" ? "#262932" : "#f9f9f9")};
  color: ${({ theme }) => (theme === "dark" ? "#e0e0e0" : "#333")};
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }

  &:disabled {
    background: ${({ theme }) => (theme === "dark" ? "#333" : "#eee")};
    cursor: not-allowed;
  }
`;

export const TransferButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  line-height: 1.2;
  text-align: left;
  padding-left: 0.5rem;
`;