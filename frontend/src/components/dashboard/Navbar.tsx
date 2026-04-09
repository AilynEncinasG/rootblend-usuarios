// frontend/src/components/dashboard/Navbar.tsx
import styled from 'styled-components';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
// 1. IMPORTA LogoImage DESDE GlobalStyles
import { StyledNavbar, LogoImage } from '../../styles/GlobalStyles'; 
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

const SearchBar = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 400px;
  input {
    background: transparent; border: none; color: white; outline: none; width: 100%;
    &::placeholder { color: rgba(255,255,255,0.5); }
  }
`;

export const Navbar = () => (
  <StyledNavbar>
    {/* 2. REEMPLAZA LogoText POR LogoImage DENTRO DEL Link */}
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <LogoImage src={Logo} alt="RootBlend Logo" />
    </Link>

    <SearchBar>
      <FiSearch color="rgba(255,255,255,0.5)" />
      <input type="text" placeholder="Buscar streams..." />
    </SearchBar>

    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <FiBell size={20} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }} />
      
      <Link to="/login" style={{ color: 'inherit', display: 'flex', textDecoration: 'none' }}>
        <FiUser size={25} style={{ color: '#00f2fe', cursor: 'pointer' }} />
      </Link>
    </div>
  </StyledNavbar>
);