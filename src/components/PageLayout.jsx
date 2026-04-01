import NavBar from "./NavBar.jsx";
export default function PageLayout({children}) {
    return(
        <>
            <NavBar/>
            <div className="min-h-screen flex justify-center items-center">

                <div className="w-[90%] h-screen bg-white p-6">
                    {children}
                </div>

            </div>
        </>
    )
}