import Exchange from "../assets/exchange.svg";

const Header = () => {
  return (
    <nav id="header">
      <div className="container">
        <img src={Exchange} alt="exchange icon" />
        <span className="title">unit converter</span>
      </div>
    </nav>
  );
};

export default Header;
