import Button from "./Button";
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function FAQGeneratorNavigationTab() {
    return ( 
        <div className="w-full flex gap-2">
            <Button style={{width:"100%"}} Icon={LinkIcon}>Depuis une URL</Button>
            <Button style={{width:"100%"}} Icon={AttachFileIcon} variant="secondary">Depuis un fichier</Button>
        </div>
     );
}

export default FAQGeneratorNavigationTab;