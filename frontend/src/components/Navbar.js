import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthenticateContext } from "../hooks/useAuthenticateContext";
import { useAdminAuthContext } from "../hooks/useAdminAuthContext";
const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthenticateContext();
  const { adm } = useAdminAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <header className="nav">
      <Link to={adm ? "/control": "/"} className="home">
        <svg
          className="nav_logo"
          width="546"
          height="400"
          viewBox="0 0 546 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52.8868 281.603L5.7735 200L52.8868 118.397H147.113L194.227 200L147.113 281.603H52.8868Z"
            stroke="white"
            stroke-width="10"
          />
          <path
            className="logo_letter"
            d="M131.68 163.968V240H120.672L85.984 191.744C83.808 188.8 81.888 185.728 80.48 183.168H79.968V240H68.064V163.968H80.224L113.632 210.56C115.808 213.504 117.728 216.448 119.136 219.008H119.648V163.968H131.68Z"
            fill="white"
          />
          <path
            d="M226.887 181.603L179.774 100L226.887 18.3975H321.113L368.227 100L321.113 181.603H226.887Z"
            stroke="white"
            stroke-width="10"
          />
          <path
            className="logo_letter"
            d="M276.88 63.072C299.792 63.072 316.176 79.584 316.176 101.984C316.176 124.384 299.792 140.896 276.88 140.896C254.096 140.896 237.712 124.384 237.712 101.984C237.712 79.584 254.096 63.072 276.88 63.072ZM276.88 129.76C292.496 129.76 303.248 117.984 303.248 101.984C303.248 86.24 292.496 74.208 276.88 74.208C261.392 74.208 250.64 85.984 250.64 101.984C250.64 117.728 261.392 129.76 276.88 129.76Z"
            fill="white"
          />
          <path
            d="M226.887 381.603L179.774 300L226.887 218.397H321.113L368.227 300L321.113 381.603H226.887Z"
            stroke="white"
            stroke-width="10"
          />
          <path
            className="logo_letter"
            d="M302.096 335.392C296.336 339.104 288.016 340.896 278.928 340.896C254.096 340.896 237.712 324.64 237.712 301.984C237.712 279.584 253.968 263.072 276.624 263.072C287.12 263.072 294.672 265.12 301.072 269.472L296.976 280.864C292.112 277.024 285.2 274.592 277.392 274.592C261.648 274.592 250.512 285.6 250.512 301.984C250.512 317.856 262.288 329.376 279.312 329.376C287.888 329.376 296.336 327.072 301.712 323.104L302.096 335.392Z"
            fill="white"
          />
          <path
            d="M398.887 281.603L351.774 200L398.887 118.397H493.113L540.227 200L493.113 281.603H398.887Z"
            stroke="white"
            stroke-width="10"
          />
          <path
            className="logo_letter"
            d="M469.528 167.168L467.096 178.176C462.872 175.744 454.68 174.08 448.28 174.08C438.296 174.08 432.792 177.792 432.792 184.192C432.792 199.424 472.728 192 472.728 218.24C472.728 232.192 462.616 240.896 443.16 240.896C433.944 240.896 424.984 238.848 419.736 236.032L421.016 224.384C426.008 227.328 435.096 229.888 443.544 229.888C454.808 229.888 460.056 226.176 460.056 219.392C460.056 203.648 419.992 211.456 419.992 185.216C419.992 172.16 430.36 163.072 448.024 163.072C455.704 163.072 464.28 164.48 469.528 167.168Z"
            fill="white"
          />
          <rect
            x="199.723"
            y="140"
            width="10"
            height="37"
            transform="rotate(59.0231 199.723 140)"
            fill="white"
          />
          <rect
            x="368.723"
            y="235"
            width="10"
            height="37"
            transform="rotate(59.0231 368.723 235)"
            fill="white"
          />
          <rect x="272" y="181" width="10" height="37" fill="white" />
        </svg>
        <span className="nocs_sub">
          <h1 className="nocs_text">NOCS</h1>
          <p>Attenance Monitoring E-System</p>
        </span>
      </Link>
      {user && (
        <>
          <div className="nav_link">
            <ul>
              <li>
                <Link to="/" className="ind-navlink">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/attendance_all" className="ind-navlink">
                  Attendances
                </Link>
              </li>
              <li>
                <Link to="/profile" className="ind-navlink">Profile</Link>
              </li>
            </ul>
          </div>
        </>
      )}
      {adm && (
        <>
          <div className="nav_link">
            <ul>
              <li>
                <Link to="/control" className="ind-navlink">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/control/profile" className="ind-navlink">Profile</Link>
              </li>
            </ul>
          </div>
        </>
      )}
      {adm || user ? (
        <>
          <div>
            <button onClick={handleClick} className="btn-logout">
              <p>Logout</p>
            </button>
          </div>
        </>
      ) :
        <>
          <div className="nav_link">
            <ul>
              <li>
                <Link to="/control" className="ind-navlink">
                  ADMIN LOGIN
                </Link>
              </li>

            </ul>
          </div>
        </>
      }
    </header>
  );
};

export default Navbar;
