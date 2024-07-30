import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = () => {
    const { theme, changeTheme } = useContext(ThemeContext);

    return (
        <div className="navbar bg-neutral flex justify-between p-3">
            <div className="navbar-start"></div>
            <div className="text-2xl navbar-center">
                <h1 className="text-center text-neutral-content" id="navbar-title">Pomigos</h1>
            </div>
            <div className="navbar-end">
                <select
                    name="theme"
                    value={theme}
                    onChange={e => changeTheme(e.target.value)}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                    <option value="retro">Retro</option>
                    <option value="forest">Forest</option>
                    <option value="coffee">Coffee</option>
                </select>
            </div>
        </div>
    );
};

export default Navbar;