import {BodyLong, BodyShort, Box, HGrid, Label, VStack} from "@navikt/ds-react";
import {useFetchAuditLogg} from "../api/apiService";
import {Audit} from "../types/Audit";

type ShowAuditLoggProps = {
    fnr: string;
}

export default function ShowAuditLogg({fnr}: Readonly<ShowAuditLoggProps>) {
    const foo = useFetchAuditLogg(fnr)
    return (<VStack padding="space-8" gap="space-16">
        {foo.data?.items
            .map((item) => <AuditLoggVisning key={item.id} audit={item}/>)}

    </VStack>)
}

function AuditLoggVisning({audit}: Readonly<{ audit: Audit }>) {
    return (<Box background={"surface-default"}
                 padding="space-16"
                 borderRadius="large">
        <VStack gap="space-8">
            <HGrid gap="space-16" columns={3}>
                <BodyShort> {audit.id} </BodyShort>
                <BodyShort> {audit.brukerId} </BodyShort>
                <BodyShort> {audit.opprettet} </BodyShort>
            </HGrid>
                <Label> {audit.tag} </Label>
            <Box background={"surface-subtle"} padding="space-8" borderRadius="medium">
                <BodyLong> {audit.informasjon} </BodyLong>
            </Box>
        </VStack>
    </Box>)
}