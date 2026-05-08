import {Box, Heading, HGrid} from "@navikt/ds-react";
import Errorhandler from "../components/Errorhandler";
import {useState} from "react";
import SoekFlereFnr from "../components/SoekFlereFnr";

export type PersonerProps = {
}

export default function Personer() {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string[]>([]);

    const error = null; // const {data, error, isLoading} = useFetchSomething(fnr);

    return (
        <HGrid gap="space-24" columns={2}>
            <Box margin={"space-24"}>
                <Heading spacing level="3" size="medium">Personinformasjon</Heading>
                <SoekFlereFnr/>
                <Errorhandler heading={"Feil ved henting av person:"} error={error}/>
            </Box>
        </HGrid>
    )
}