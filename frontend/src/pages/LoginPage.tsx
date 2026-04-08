import LoginForm from "../components/login/LoginForm";

const LoginPage = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/fondo.jpg')",
        backgroundSize: "120%",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 30,
        borderRadius: 10
      }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;