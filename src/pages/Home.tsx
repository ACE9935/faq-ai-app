import FAQGenerator from "../tool-components/FAQGenerator";
import { useAuth } from "../hooks/useAuth";
import FaqSidebar from "../components/FaqSideBar";

function Home() {

    const {user}=useAuth()

    const handleNewFaq = () => {
     console.log('Creating new FAQ...');
    };

    const handleSelectFaq = (faq: any) => {
     console.log('Selected FAQ:', faq);
    };

    return ( 
    <main className='flex gap-10'>
        
            <FaqSidebar 
              onNewFaq={handleNewFaq}
              onSelectFaq={handleSelectFaq}
              className="border-0"
            />
    <div className="w-full flex flex-col items-center gap-5 p-6 py-12">
     <FAQGenerator/>
     </div>
    </main>
     );
}

export default Home;