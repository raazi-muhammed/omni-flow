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
import { Textarea } from "@/components/ui/textarea";
import { makeApiCall } from "@/lib/apicaller";
import { TableService } from "@/services/api/table.service";
import AnimatedSpinner from "@/components/custom/AnimatedSpinner";
import { canSubmitFrom } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(3, "Invalid"),
    description: z.string().optional(),
});

export default function AddTableForm() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const service = new TableService();
        await makeApiCall(() => service.addTable(values).exec(), {
            toast,
            afterSuccess: () => {
                router.back();
                router.refresh();
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="w-full"
                    type="submit"
                    disabled={canSubmitFrom(form, { type: "edit" })}>
                    <AnimatedSpinner isLoading={form.formState.isSubmitting} />
                    Add table
                </Button>
            </form>
        </Form>
    );
}
