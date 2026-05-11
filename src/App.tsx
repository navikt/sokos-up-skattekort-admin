import Batchdetaljer from "./pages/Batchdetaljer";
import {initGrafanaFaro} from "./util/grafanaFaro";
import {Tabs} from "@navikt/ds-react";
import {ClockDashedIcon, FileIcon, HouseIcon, PersonGroupIcon, PersonIcon} from "@navikt/aksel-icons";
import Person from "./pages/Person";
import {Frontside} from "./pages/Frontside";
import {useEffect, useState} from "react";
import type {DateRange} from "./components/SoekBatch";
import BestillMedFil from "./pages/BestillMedFil";

export default function App() {
    useEffect(() => {
        initGrafanaFaro();
    }, []);
    const [activeTab, setActiveTab] = useState<string>("home");
    const [activeFnr, setActiveFnr] = useState<string| null>(null);
    const [activeDateRange, setActiveDateRange] = useState<DateRange | null>(null);
    function handleVisPerson(fnr: string) {
        setActiveFnr(fnr);
        setActiveTab("person");
    }
    
    function handleShowBatchesAround(date: Date) {
        setActiveDateRange({from: new Date(date.getTime() - 1000 * 60 * 60), to: new Date(date.getTime() + 1000 * 60 * 60)} );
        setActiveTab("batcher");
    }

    function handleShowBatchesAt(date: Date) {
        setActiveDateRange({from: date, to: date});
        setActiveTab("batcher");
    }

    return <Tabs value={activeTab} onChange={setActiveTab}>
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
            {/*<Tabs.Tab*/}
            {/*    value="personer"*/}
            {/*    label="Flere personer"*/}
            {/*    icon={<PersonGroupIcon title="personer" fontSize="1.5rem" />}*/}
            {/*/>*/}
            <Tabs.Tab
                value="bolk"
                label="Bestill med fil"
                icon={<FileIcon title="bestill med fil" fontSize="1.5rem" />}
            />
        </Tabs.List>
        <Tabs.Panel value="home">
            <Frontside handleVisPerson={handleVisPerson} handleShowBatchesAround={handleShowBatchesAround} />
        </Tabs.Panel>
        <Tabs.Panel value="batcher">
            <Batchdetaljer dateRange={activeDateRange}/>
        </Tabs.Panel>
        <Tabs.Panel value="person">
            <Person fnr={activeFnr} handleShowBatchesAt={handleShowBatchesAt}/>
        </Tabs.Panel>
        {/*<Tabs.Panel value="personer">*/}
        {/*    <Personer />*/}
        {/*</Tabs.Panel>*/}
        <Tabs.Panel value="bolk">
            <BestillMedFil />
        </Tabs.Panel>
    </Tabs>
}
