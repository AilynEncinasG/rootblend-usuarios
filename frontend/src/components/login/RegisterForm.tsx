// frontend/src/components/login/RegisterForm.tsx
import { FiUser, FiLock, FiUserPlus } from "react-icons/fi";
import { Card, InputGroup, Input, Button } from "../../styles/GlobalStyles";
export const RegisterForm = () => (
  <Card>
    <InputGroup>
      <FiUser style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
      <Input type="text" placeholder="Email" />
    </InputGroup>
    <InputGroup>
      <FiLock style={{ position: 'absolute', left: 15, top: 18, color: '#00f2fe' }} />
      <Input type="password" placeholder="Crear contraseña" />
    </InputGroup>
    <Button>REGISTRARSE <FiUserPlus /></Button>
  </Card>
);