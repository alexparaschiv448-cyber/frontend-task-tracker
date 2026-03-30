export default function PageLayout({children}) {

    return(
        <>
            <div className="min-h-screen flex justify-center items-center">

                <div className="w-[90%] h-screen bg-white p-6">
                    {children}
                </div>

            </div>
        </>
    )
}