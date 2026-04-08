import {useEffect} from "react";
import SkattekortAdmin from "./pages/SkattekortAdmin";
import {initGrafanaFaro} from "./util/grafanaFaro";

export default function App() {
    useEffect(() => {
        initGrafanaFaro();
    }, []);

    return <SkattekortAdmin/>;
}
