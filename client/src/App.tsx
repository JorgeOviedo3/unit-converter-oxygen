import Converter from "./components/Converter";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Saved from "./components/Saved";

function App() {
  return (
    <div className="main">
      <Header />
      <Converter />
      <Saved />
      <Footer />
    </div>
  );
}

export default App;
