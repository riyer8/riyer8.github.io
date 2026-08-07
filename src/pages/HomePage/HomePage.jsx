import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./MainContent/MainContent";

const HomePage = () => {
  const containerStyle = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    fontFamily: "var(--font-ui)",
    margin: 0,
    padding: 0,
  };

  return (
    <div style={containerStyle}>
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default HomePage;
