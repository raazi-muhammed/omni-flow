import Heading from "@/components/custom/Heading";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { AddIcon, EditIcon } from "@/lib/icons";
import { ITeam } from "@/types/database";
import { cookies } from "next/headers";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import ActionItemsContainer from "@/components/layout/ActionItemsContainer";
import ErrorMessage from "@/components/custom/ErrorMessage";
import { PROJECT_TOKEN_COOKIE, USER_TOKEN_COOKIE } from "@/constants/cookies";
import { Fragment } from "react";
import { TeamService } from "@/services/api/team.service";

async function loadTeams() {
    const userToken = cookies().get(USER_TOKEN_COOKIE)?.value;
    const projectToken = cookies().get(PROJECT_TOKEN_COOKIE)?.value;

    const service = new TeamService({
        headers: {
            Authorization: `Bearer ${userToken}`,
            Project: `Bearer ${projectToken}`,
        },
    });
    const response = await service.getTeams().exec();

    return response.data;
}

export default async function page() {
    const teams: ITeam[] = await loadTeams();
    return (
        <div className="w-full">
            <Container>
                <ActionItemsContainer>
                    <Link href="teams/invite-member">
                        <Button size="sm" variant="muted">
                            <AddIcon />
                            Invite an member
                        </Button>
                    </Link>
                    <Link href="teams/add-team">
                        <Button size="sm">
                            <AddIcon />
                            Add a team
                        </Button>
                    </Link>
                </ActionItemsContainer>
                {teams.length <= 0 && (
                    <ErrorMessage message="Not teams yet" type="info" />
                )}
                {teams.map((team, index) => (
                    <Fragment key={index}>
                        <section className="flex justify-between">
                            <Heading variant="sm">{team.name}</Heading>
                            <Link href={`teams/${team.name}`}>
                                <Button size="sm" variant="muted">
                                    <EditIcon /> Edit team
                                </Button>
                            </Link>
                        </section>
                        <Separator className="my-4" />
                    </Fragment>
                ))}
            </Container>
        </div>
    );
}
