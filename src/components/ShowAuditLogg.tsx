import {BodyLong, BodyShort, Box, Button, HGrid, Label, VStack} from "@navikt/ds-react";
import {useFetchAuditLogg} from "../api/apiService";

type ShowAuditLoggProps = {
    fnr: string;
    jumpToBatches: (date: Date) => void;
}

export default function ShowAuditLogg({fnr, jumpToBatches}: Readonly<ShowAuditLoggProps>) {
    const {data, error, isLoading} = useFetchAuditLogg(fnr)
    
    return (<VStack padding="space-8" gap="space-16">
        {data?.items
            .map((audit) => (
                <Box key={audit.id}
                    background={"surface-default"}
                                padding="space-16"
                                borderRadius="large">
                <VStack gap="space-8">
                    <HGrid gap="space-16" columns={3}>
                        <BodyShort> {audit.id} </BodyShort>
                        <BodyShort> {audit.brukerId} </BodyShort>
                        <Button variant={"tertiary"} onClick={() => jumpToBatches(new Date(audit.opprettet))}> {audit.opprettet} </Button>
                    </HGrid>
                    <Label> {audit.tag} </Label>
                    <Box background={"surface-subtle"} padding="space-8" borderRadius="medium">
                        <BodyLong> {audit.informasjon} </BodyLong>
                    </Box>
                </VStack>
            </Box>))
        }
    </VStack>)
}