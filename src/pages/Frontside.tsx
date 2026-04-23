import {Box, Heading, HGrid, Table, VStack} from "@navikt/ds-react";
import LabelText from "../components/LabelText";


export function Frontside() {
    return (
        <VStack gap={"space-24"} padding={"space-24"}>
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"large"} spacing>Informasjon om Sokos-skattekort</Heading>
                <LabelText label={"Skattekort for 2025"} text={"3 456 789"}/>
                <LabelText label={"Skattekort for 2026"} text={"2 345 678"}/>
                <LabelText label={"Abonnementer"} text={"2 345 678"}/>
                <LabelText label={"Personer"} text={"4 567 890"}/>
                <LabelText label={"Ferdige batcher"} text={"1 234"}/>
            </Box>
        <HGrid gap="space-24" columns={2}>
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Planlagte utsendinger</Heading>
                <Table title="Planlagte utsendinger" zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Utsending</Table.HeaderCell>
                        <Table.HeaderCell>Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell>Forsystem</Table.HeaderCell>
                        <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                        <Table.HeaderCell>Opprettet</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>123</Table.DataCell>
                        <Table.DataCell>123456 12345</Table.DataCell>
                        <Table.DataCell>OS</Table.DataCell>
                        <Table.DataCell>2026</Table.DataCell>
                        <Table.DataCell>20.03.2026
                            19:27:56,411</Table.DataCell>

                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>124</Table.DataCell>
                        <Table.DataCell>123456 12345</Table.DataCell>
                        <Table.DataCell>OS</Table.DataCell>
                        <Table.DataCell>2026</Table.DataCell>
                        <Table.DataCell>21.03.2026
                            19:27:56,411</Table.DataCell>

                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>125</Table.DataCell>
                        <Table.DataCell>123456 12345</Table.DataCell>
                        <Table.DataCell>OS</Table.DataCell>
                        <Table.DataCell>2026</Table.DataCell>
                        <Table.DataCell>22.03.2026
                            19:27:56,411</Table.DataCell>

                    </Table.Row>
                </Table.Body>
            </Table></Box>
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Planlagte bestillinger</Heading>
                <Table title="Planlagte bestillinger" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Bestilling</Table.HeaderCell>
                            <Table.HeaderCell>Fødselsnummer</Table.HeaderCell>
                            <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                            <Table.HeaderCell>Bestillingsbatch</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.DataCell>123</Table.DataCell>
                            <Table.DataCell>223456 12345</Table.DataCell>
                            <Table.DataCell>2026</Table.DataCell>
                            <Table.DataCell>1234567</Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.DataCell>124</Table.DataCell>
                            <Table.DataCell>323456 12345</Table.DataCell>
                            <Table.DataCell>2026</Table.DataCell>
                            <Table.DataCell></Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.DataCell>125</Table.DataCell>
                            <Table.DataCell>423456 12345</Table.DataCell>
                            <Table.DataCell>2026</Table.DataCell>
                            <Table.DataCell></Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.DataCell>128</Table.DataCell>
                            <Table.DataCell>523456 12345</Table.DataCell>
                            <Table.DataCell>2026</Table.DataCell>
                            <Table.DataCell></Table.DataCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.DataCell>129</Table.DataCell>
                            <Table.DataCell>623456 12345</Table.DataCell>
                            <Table.DataCell>2026</Table.DataCell>
                            <Table.DataCell></Table.DataCell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Box>
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Batcher under behandling</Heading>
                <Table title="Batcher under behandling" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Ref</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Opprettet</Table.HeaderCell>
                            <Table.HeaderCell>Oppdatert</Table.HeaderCell>
                            <Table.HeaderCell>Data sendt</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.DataCell>BR12356</Table.DataCell>
                            <Table.DataCell>NY</Table.DataCell>
                            <Table.DataCell>BESTILLING</Table.DataCell>
                            <Table.DataCell>22.03.2026
                                19:27:56,411</Table.DataCell>
                            <Table.DataCell>22.03.2026
                                19:27:56,411</Table.DataCell>
                            <Table.DataCell>Request(2026, 30819598882)</Table.DataCell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Box>
        </HGrid>
        </VStack>
            
    )
}