import { useContext } from "react";
import { Link } from "react-router-dom";
import { CoursePreferencesContext } from "../utils";

{/* height of the navbar = height of content + 2*py = 48px + 2*16px = 80px = h-20 (tailwind) */ }
const Nav = () => {
    const coursePreferences = useContext(CoursePreferencesContext);
    return (
        <>
            <div className="w-full bg-upenn-blue text-white py-4 px-8 fixed z-50 top-0" style={{
            }}>
                <div className="flex items-center">
                    <Link to="/"><h2 className="text-2xl">Penn Course Cart</h2></Link>

                    {/* shopping cart icon */}
                    <button className="relative ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                        </svg>
                        <div className="absolute w-full h-full inset-0 flex justify-center text-center text-upenn-blue font-bold top-2">{
                            Object.values(coursePreferences).filter(preference => preference === "cart").length
                        }</div>
                    </button>

                </div>
            </div>

            <div className="absolute w-full top-0 left-0 bg-upenn-red h-[88px] z-30" />

            {/* a div the same size of the navbar that is statically-positioned so that elements after the nav are not overlapping. */}
            <div className="h-20"></div>
        </>
    )
}

export default Nav;