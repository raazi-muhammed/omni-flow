"use client";

import ErrorMessage from "@/components/custom/ErrorMessage";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IModule } from "@/types/database";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Spinner from "@/components/custom/Spinner";
import { Button } from "@/components/ui/button";
import { AddIcon } from "@/lib/icons";
import Link from "next/link";
import CustomLink from "@/components/custom/CustomLink";
import { ModuleService } from "@/services/api/module.service";
import AnimateCard from "@/components/animated/AnimateCard";

export default function ModuleCard({
    module,
    projectId,
}: {
    module: IModule;
    projectId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [subModules, setSubModules] = useState<IModule[] | null>(null);

    async function getSubModules() {
        setLoading(true);
        const service = new ModuleService();
        const response = await service
            .getModules({ parentModule: module.id })
            .exec();
        setSubModules(response.data);
        setLoading(false);
    }

    return (
        <Accordion
            type="single"
            collapsible
            onValueChange={() => {
                if (!subModules) getSubModules();
            }}>
            <AccordionItem value="item-1 ">
                <AnimateCard type="subtle">
                    <Link href={`/projects/${projectId}/modules/${module.id}`}>
                        <Card className="flex align-middle">
                            <AccordionTrigger className="h-full w-fit rounded-r-none bg-muted hover:bg-muted/90"></AccordionTrigger>
                            <section className="h-fit w-full p-3">
                                {module.name}

                                <section>
                                    {module.dependencies.length > 0 ? (
                                        <>
                                            <Label className="mb-0">
                                                Dependencies
                                            </Label>
                                            <section className="-mt-1 flex h-fit flex-wrap gap-4">
                                                {module.dependencies.map(
                                                    (dep) => (
                                                        <Link
                                                            key={dep.id}
                                                            href={`/projects/${projectId}/modules/${dep.id}`}>
                                                            <Label className="hover:underline">
                                                                {dep.name}
                                                            </Label>
                                                        </Link>
                                                    )
                                                )}
                                            </section>
                                        </>
                                    ) : (
                                        <Label>No dependencies</Label>
                                    )}
                                </section>
                            </section>
                            <Link
                                href={`/projects/${projectId}/modules/add?parentModule=${module.id}`}
                                legacyBehavior>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="my-auto me-2 text-secondary">
                                    <AddIcon />
                                    Add module
                                </Button>
                            </Link>
                        </Card>
                    </Link>
                </AnimateCard>
                <AccordionContent className="my-4 ms-4 py-0">
                    <section className="grid w-full gap-4">
                        <>
                            {subModules?.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    projectId={projectId}
                                    module={module}
                                />
                            ))}
                            {loading ? (
                                <div className="mx-auto my-2 w-fit">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    {subModules?.length === 0 && (
                                        <ErrorMessage
                                            message="No sub modules"
                                            type="info"
                                        />
                                    )}
                                </>
                            )}
                        </>
                    </section>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
