import ActionItemsContainer from "@/components/layout/ActionItemsContainer";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROJECT_TOKEN_COOKIE, USER_TOKEN_COOKIE } from "@/constants/cookies";
import { AddIcon } from "@/lib/icons";
import { getEndpoints } from "@/services/endpoints.service";
import { IEndpoint } from "@/types/database";
import { cookies } from "next/headers";
import Link from "next/link";
import { Eye as ViewIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import {
    SectionAside,
    SectionContent,
    SectionSplitter,
} from "@/components/layout/SectinSplitter";

async function loadEndpoints() {
    const userToken = cookies().get(USER_TOKEN_COOKIE)?.value;
    const projectToken = cookies().get(PROJECT_TOKEN_COOKIE)?.value;

    const response = await getEndpoints({
        headers: {
            Authorization: `Bearer ${userToken}`,
            Project: `Bearer ${projectToken}`,
        },
    });
    return response.data;
}

export default async function page({
    params,
    children,
}: {
    params: { endpointId: string };
    children: ReactNode;
}) {
    const endpoints: IEndpoint[] = await loadEndpoints();
    return (
        <Container>
            <SectionSplitter>
                <SectionAside className="mt-0 space-y-4">
                    <ActionItemsContainer>
                        <Link href="add-endpoint">
                            <Button size="sm">
                                <AddIcon />
                                Add endpoint
                            </Button>
                        </Link>
                    </ActionItemsContainer>
                    {endpoints.map((point) => (
                        <Card className="flex">
                            <div className="flex min-w-20 rounded-l-lg border-r bg-muted px-3">
                                <p className="my-auto">{point.method}</p>
                            </div>
                            <div className="mx-4 my-2 flex flex-col gap-0">
                                <p className="font-bold">{point.name}</p>
                                <Label>{point.route}</Label>
                            </div>
                            <Link
                                className="my-auto me-6 ms-auto"
                                href={`${point.id}`}>
                                <Button size="icon" variant="ghost">
                                    <ViewIcon
                                        className="text-secondary"
                                        size="1.2em"
                                    />
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </SectionAside>
                <SectionContent className="overflow-auto">
                    {children}
                </SectionContent>
            </SectionSplitter>
        </Container>
    );
}
