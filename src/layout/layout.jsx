import Footer from "../components/footer";
import Header from "./header";

export default function Layout ({children} ) {

    return ( 
        <>
        <Header/>
        <div className="container-fluid ">
             {children}
        </div>

       

        </>
    )
}