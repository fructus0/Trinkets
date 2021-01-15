import {React, useContext} from "react";
import Avatar from "@material-ui/core/Avatar";
import background from "../../images/UserBackground.jpg";
import { Link } from "react-router-dom";
import {Link as FlatButton} from "@material-ui/core";
import { Icon } from "react-materialize";
import {UserContext} from "../../context/user.context";
const MobileMenu = () => {
  const {logout, user, isAuthenticated} = useContext(UserContext);
  return (
    <ul className="sidenav" id="mobile">
      {isAuthenticated && (
      <li>
        <div className="user-view">
          <div className="background">
            <img alt="back" src={background}></img>
          </div>
          <Avatar className="avatar red lighten-2">{user.name[0]}</Avatar>
          <span className="name">{user.name}</span>
          <span>{"Количество элементов: 30"}</span>
        </div>
      </li>)
}
      <li>
        <div className="input-field">
          <input
            className="search"
            type="search"
            placeholder="Начните печатать.."
          />
          <Icon className="blue-grey-text text-darken-2 sidenav-close">search</Icon>
        </div>
      </li>
      <li>
        {isAuthenticated ? (
          <Link className="blue-grey-text text-darken-2 sidenav-close" to={`/profile/${user.id}`}>
            <Icon className="blue-grey-text text-darken-2">favorite</Icon>
            Моя коллекция
          </Link>
        ) : (
          <Link className="blue-grey-text text-darken-2 nav-link sidenav-close" to="/signIn">
            Вход
          </Link>
        )}
      </li>
      <li>
        {isAuthenticated ? (
          <Link className="blue-grey-text text-darken-2 nav-link sidenav-close" to="/" onClick={logout}>Выход</Link>
        ) : (
          <Link className="blue-grey-text text-darken-2 nav-link sidenav-close" to="/signUp">
            Регистрация
          </Link>
        )}
      </li>
      <li>
        <div className="divider"></div>
      </li>
      <li>
        <div className="switch">
          <label className="blue-grey-text text-darken-2">
            <Icon>brightness_4</Icon>
            <input type="checkbox" />
            <span className="lever" />
            <Icon>brightness_5</Icon>
          </label>
        </div>
      </li>
      <li>
        <FlatButton className="blue-grey-text text-darken-2 flat-button">
          <Icon className="blue-grey-text text-darken-2">language</Icon>
          Английский
        </FlatButton>
      </li>
    </ul>
  );
};
export default MobileMenu;
