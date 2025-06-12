import FAQGenerator from "../tool-components/FAQGenerator";
import FaqSidebar from "../components/FaqSideBar";
import { useState } from "react";

function Home() {
    const [open, setOpen] = useState(true);

    const toggleDrawer = (newOpen: boolean) => () => {
     setOpen(newOpen);
    };

    return ( 
    <main className='flex gap-10'>
        
         <div className="hidden lg:block min-h-screen">
            <FaqSidebar 
              className="border-0"
            />
          </div>
    <div className="w-full flex flex-col items-center gap-5 p-6 py-12">
     <FAQGenerator/>
     </div>
    </main>
     );
}

export default Home;