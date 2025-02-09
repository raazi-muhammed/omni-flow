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
import { useRouter } from "next/navigation";
import { AddIcon } from "@/lib/icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dataValueTypes } from "@/types/database";
import { logger } from "@/lib/logger";
import { makeApiCall } from "@/lib/apicaller";
import { ApiDocService } from "@/services/api/api-doc.service";
import AnimatedSpinner from "@/components/custom/AnimatedSpinner";
import { canSubmitFrom } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(1, "Invalid"),
    type: z
        .string({
            required_error: "Please select a language.",
        })
        .min(1, "Invalid"),
    description: z.string().optional(),
});

export default function AddVariableForm({
    endpointId,
}: {
    endpointId: string;
}) {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "STRING",
            description: "",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const service = new ApiDocService();
        await makeApiCall(
            () => service.addEndpointVariable(endpointId, values).exec(),
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
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
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Language</FormLabel>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={canSubmitFrom(form, { type: "edit" })}>
                    <AnimatedSpinner isLoading={form.formState.isSubmitting} />
                    <AddIcon />
                    Add
                </Button>
            </form>
        </Form>
    );
}
