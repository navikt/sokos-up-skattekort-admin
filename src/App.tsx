import {useEffect} from "react";
import Batchdetaljer from "./pages/Batchdetaljer";
import {initGrafanaFaro} from "./util/grafanaFaro";
import {Heading, Tabs} from "@navikt/ds-react";
import {ClockDashedIcon, HouseIcon, PersonIcon} from "@navikt/aksel-icons";
import Person from "./pages/Person";
import {Frontside} from "./pages/Frontside";

export default function App() {
    useEffect(() => {
        initGrafanaFaro();
    }, []);

    return <Tabs defaultValue="home">
        <Tabs.List>
            <Tabs.Tab
                value="home"
                label="Skattekort Admin"
                icon={<HouseIcon aria-hidden/>}
            />
            <Tabs.Tab
                value="batcher"
                label="Batchdetaljer"
                icon={<ClockDashedIcon aria-hidden/>}
            />
            <Tabs.Tab
                value="person"
                label="Person"
                icon={<PersonIcon aria-hidden/>}
            />
        </Tabs.List>
        <Tabs.Panel value="home">
            <Frontside />
        </Tabs.Panel>
        <Tabs.Panel value="batcher">
            <Batchdetaljer/>
        </Tabs.Panel>
        <Tabs.Panel value="person">
            <Heading size={"medium"} spacing>Personspesifikk informasjon</Heading>
            <Person/>
        </Tabs.Panel>
    </Tabs>
}
