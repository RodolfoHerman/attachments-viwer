import { useEffect, useState } from 'react';
import AttachmentsViwer from '../../shared/AttachmentsViwer';
import './App.css';
import "react-image-gallery/styles/css/image-gallery.css";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'halogenium';

function App() {
    const [files, setFiles] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log(files);
    }, [files])

    const loader = () => (
        <div className="App-loader-content">
            <ClipLoader style={{ top: "45%", left: "49%", position: "absolute" }} loading={loaded} color="#26A65B" size="46px" margin="0px" />
        </div>
    );

    return (
        <div className="App-container">
            {
                loaded && loader()
            }
            <AttachmentsViwer 
                setFiles={setFiles}
                setLoaded={setLoaded}
                amountOfFiles={3}
            />
        </div>
    );
}

export default App;
