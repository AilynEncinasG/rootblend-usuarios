// frontend/src/components/login/LoginForm.tsx
import { FiUser, FiLock, FiChevronRight } from "react-icons/fi";
import { Card, InputGroup, Input, Button } from "../../styles/GlobalStyles";

export const LoginForm = () => (
  <Card>
    <InputGroup>
      <FiUser style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
      <Input type="text" placeholder="Email o Usuario" />
    </InputGroup>
    <InputGroup>
      <FiLock style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
      <Input type="password" placeholder="Contraseña" />
    </InputGroup>
    <Button>ENTRAR <FiChevronRight /></Button>
  </Card>
);