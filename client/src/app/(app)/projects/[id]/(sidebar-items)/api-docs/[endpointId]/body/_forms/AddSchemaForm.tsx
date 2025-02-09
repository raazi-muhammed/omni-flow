"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";
import { AddIcon } from "@/lib/icons";
import { useState } from "react";
import { EDataTypes, dataValueTypes } from "@/types/database";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HelpCircle, Key, Sparkles } from "lucide-react";
import { logger } from "@/lib/logger";
import { makeApiCall } from "@/lib/apicaller";
import { ApiDocService } from "@/services/api/api-doc.service";
import AnimatedSpinner from "@/components/custom/AnimatedSpinner";
import { canSubmitFrom } from "@/lib/utils";

const formSchema = z.object({
    key: z.string().min(1, "Invalid"),
    type: z.string().min(1, "Invalid"),
    options: z.array(z.string()).optional().default([]),
});

export default function AddSchemaForm({ endpointId }: { endpointId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const [value, setValue] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: "",
            type: "",
            options: [],
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const service = new ApiDocService();
        await makeApiCall(
            () => service.addEndpointSchema(endpointId, values).exec(),
            {
                toast,
                afterSuccess: () => {
                    router.refresh();
                    form.reset();
                },
            }
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 p-2">
                <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                                <Input placeholder="key" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormLabel>Type</FormLabel>
                            <Select
                                {...field}
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {dataValueTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <FormLabel>Options</FormLabel>
                    <ToggleGroup
                        value={value}
                        onValueChange={(v) => {
                            if (v) {
                                form.setValue("options", v);
                                setValue(v);
                            }
                        }}
                        type="multiple"
                        variant="outline"
                        className="mt-1 grid grid-cols-3 gap-4">
                        <ToggleGroupItem
                            className="h-11"
                            value={EDataTypes.OPTIONAL}>
                            <HelpCircle
                                size="1em"
                                className="me-2 text-secondary"
                            />
                            Optional
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            className="h-11"
                            value={EDataTypes.UNIQUE}>
                            <Sparkles
                                size="1em"
                                className="me-2 text-secondary"
                            />
                            Unique
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            className="h-11"
                            value={EDataTypes.KEY}>
                            <Key size="1em" className="me-2 text-secondary" />
                            Key
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <Button
                    className="mt-8 w-full"
                    type="submit"
                    disabled={canSubmitFrom(form, { type: "edit" })}>
                    <AnimatedSpinner isLoading={form.formState.isSubmitting} />
                    <AddIcon />
                    Add
                </Button>
            </form>
        </Form>
    );
}
