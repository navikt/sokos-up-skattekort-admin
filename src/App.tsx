import {useEffect} from "react";
import Batcher from "./pages/Batcher";
import {initGrafanaFaro} from "./util/grafanaFaro";
import {Heading, Tabs} from "@navikt/ds-react";
import {ClockDashedIcon, PersonIcon} from "@navikt/aksel-icons";
import Person from "./pages/Person";

export default function App() {
    useEffect(() => {
        initGrafanaFaro();
    }, []);

    return <Tabs defaultValue="batcher">
        <Tabs.List>
            <Tabs.Tab
                value="batcher"
                label="Batcher"
                icon={<ClockDashedIcon aria-hidden/>}
            />
            <Tabs.Tab
                value="person"
                label="Person"
                icon={<PersonIcon aria-hidden/>}
            />
        </Tabs.List>
        <Tabs.Panel value="batcher">
            <Batcher/>
        </Tabs.Panel>
        <Tabs.Panel value="person">
            <Heading size={"medium"} spacing>Personspesifikk informasjon</Heading>
            <Person/>
        </Tabs.Panel>
    </Tabs>
}
