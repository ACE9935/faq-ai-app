import { options } from "../tool-config/tone-options";
import BasicInput from "./BasicInput";
import BasicSelect from "./BasicSelect";
import BasicTextArea from "./BasicTextArea";
import Button from "./Button";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TagsInput from "./TagsInput";
import FAQGeneratorNavigationTab from "./FAQGeneratorNavigationTab";

function FAQGenerator() {
    return ( 
        <form className="flex flex-col gap-4 w-full max-w-[50rem] bg-white rounded-md p-8 shadow-md">
            <div className="flex flex-col gap-6 w-full">
                <FAQGeneratorNavigationTab/>
                <BasicInput label="URL de votre site" helperText="Entrez l'URL du site web pour lequel vous souhaitez créer des FAQ" placeholder="https://exemple.com"/>
                <BasicTextArea label="Description" placeholder="Expliquer ce que fait l'entreprise ou le produit"/>
                <BasicSelect options={options} label="Mots-clés" helperText="Choisissez le ton que vous souhaitez donner à votre FAQ"/>
                <TagsInput placeholder="Entrez les mots-clés à inclure dans la FAQ"/>
            </div>
            <Button Icon={AutoAwesomeIcon}>Générer un FAQ</Button>
        </form>
     );
}

export default FAQGenerator;