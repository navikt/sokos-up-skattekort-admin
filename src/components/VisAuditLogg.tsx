import {BodyLong, BodyShort, Box, Button, HGrid, Label, VStack} from "@navikt/ds-react";
import {toLocalDateTime} from "../util/dateUtils";
import type {Audit} from "../types/Audit";

export default function VisAuditLogg({auditLogg, jumpToBatches}: Readonly<{ auditLogg: Audit, jumpToBatches:(date:Date) => void}>) {
    return (
    <Box key={auditLogg.id}
         background={"surface-default"}
         padding="space-16"
         margin={"space-2"}
         borderRadius="large">
        <VStack gap="space-8">
            <HGrid gap="space-16" columns={3}>
                <BodyShort> {auditLogg.id} </BodyShort>
                <BodyShort> {auditLogg.brukerId} </BodyShort>
                <Button variant={"tertiary"}
                        onClick={() => jumpToBatches(new Date(auditLogg.opprettet))}> {toLocalDateTime(auditLogg.opprettet)} </Button>
            </HGrid>
            <Label> {auditLogg.tag} </Label>
            <Box background={"surface-subtle"} padding="space-8" borderRadius="medium">
                <BodyLong> {auditLogg.informasjon} </BodyLong>
            </Box>
        </VStack>
    </Box>)
}