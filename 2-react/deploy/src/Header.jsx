import { Link } from "react-router-dom";
function Header() {
  return (
    <header>
      <h1>React projektek Deploy verzió</h1>
      <ul className="menu">
        <li>
          <Link to={"/"} className="menu-btn">
            Főoldal
          </Link>
        </li>
        <li>
          <Link to={"/hangman"} className="menu-btn">
            Akasztófa
          </Link>
        </li>
        <li>
          <Link to={"/millionaire"} className="menu-btn">
            Legyen Ön is milliomos
          </Link>
        </li>
      </ul>
    </header>
  );
}
export default Header;
