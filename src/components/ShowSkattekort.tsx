import {Skeleton, VStack} from "@navikt/ds-react";
import type {Skattekort} from "../types/SkattekortResponseDTOSchema";
import VisSkattekort from "./VisSkattekort";

export type ShowSkattekortProps = {
	data: Skattekort[] | undefined;
	isLoading: boolean;
    jumpToBatches: (date: Date) => void;
};

export default function ShowSkattekort({
	data,
	isLoading,
    jumpToBatches
}: Readonly<ShowSkattekortProps>) {
	return (
		<>
			{isLoading && (
				<VStack padding="space-8" gap="space-16">
					<Skeleton variant="rounded" height={90} />
					<Skeleton variant="rounded" height={90} />
					<Skeleton variant="rounded" height={90} />
				</VStack>
			)}

			{data?.map((skattekort, index) => (
				<VStack
					key={`${skattekort.opprettet}${skattekort.id}`}
					padding="space-8"
				>
					<VisSkattekort skattekort={skattekort} jumpToBatches={jumpToBatches} open={index === 0} />
				</VStack>
			))}
		</>
	);
}
