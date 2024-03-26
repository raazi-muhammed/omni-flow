"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { IMeeting } from "@/types/database";
import { logger } from "@/lib/logger";
import { makeApiCall } from "@/lib/apicaller";
import Heading from "@/components/custom/Heading";
import { MeetingService } from "@/services/api/meeting.service";
import { DeleteAlert } from "@/components/custom/DeleteAlert";

const formSchema = z.object({
    name: z.string().min(3, "Invalid"),
    agenda: z.string().min(3, "Invalid"),
    startDate: z.date(),
    dueDate: z.date().optional(),
});

export default function EditMeetingForm({
    meeting,
    closeDialog,
}: {
    meeting: IMeeting;
    closeDialog: () => void;
}) {
    const { toast } = useToast();
    const router = useRouter();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: meeting.name,
            agenda: meeting.agenda,
            startDate: new Date(meeting.startDate),
        },
        mode: "onTouched",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        logger.debug(values);
        const service = new MeetingService();
        makeApiCall(() => service.editMeeting(meeting.id, values).exec(), {
            toast,
            afterSuccess: () => {
                closeDialog();
                router.refresh();
            },
        });
    }

    function handleDelete() {
        const service = new MeetingService();
        makeApiCall(() => service.removeMeeting(meeting.id).exec(), {
            toast,
            afterSuccess: () => {
                closeDialog();
                router.refresh();
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Heading variant="form">Info</Heading>
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
                    name="agenda"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agenda</FormLabel>
                            <FormControl>
                                <Textarea placeholder="agenda" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Heading variant="form">Details</Heading>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "text-left font-normal h-12",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}>
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Start date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "text-left font-normal h-12",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}>
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>End date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <section className="flex justify-between">
                    <DeleteAlert handleDelete={handleDelete} />
                    <div className="ms-auto flex w-fit gap-4">
                        <Button
                            onClick={() => closeDialog()}
                            type="button"
                            variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit">Edit</Button>
                    </div>
                </section>
            </form>
        </Form>
    );
}
