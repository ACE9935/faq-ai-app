import Heading1 from "../components/Heading1";
import SubHeading from "../components/SubHeading";

function IntroHeading() {
    return ( 
        <div className="flex flex-col gap-4 w-full max-w-[45rem]">
         <Heading1>Générez des FAQ optimisées pour le SEO en quelques secondes</Heading1>
         <SubHeading>Améliorez le classement de votre site web dans les moteurs de recherche grâce à des FAQ alimentées par l'IA qui répondent aux questions de votre audience.</SubHeading>
        </div>
     );
}

export default IntroHeading;