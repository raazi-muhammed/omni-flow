"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { canSubmitFrom, cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IAllMemberList, IModule } from "@/types/database";
import { logger } from "@/lib/logger";
import { makeApiCall } from "@/lib/apicaller";
import Heading from "@/components/custom/Heading";
import { useAppSelector } from "@/redux/store";
import { ModuleService } from "@/services/api/module.service";
import { TeamService } from "@/services/api/team.service";
import { TaskService } from "@/services/api/task.service";
import { AddIcon } from "@/lib/icons";
import AnimatedSpinner from "@/components/custom/AnimatedSpinner";

const formSchema = z.object({
    name: z.string().min(3, "Invalid"),
    priority: z.number(),
    startDate: z.date(),
    dueDate: z.date(),
    description: z.string().min(3, "Invalid"),
    module: z.string().optional(),
    status: z.string(),
    reporter: z.string().min(1, "Invalid").optional(),
    assignee: z.string().min(1, "Invalid"),
});

export default function AddTaskForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [modules, setModules] = useState<IModule[]>([]);
    const [membersList, setMembersList] = useState<IAllMemberList[]>([]);
    const params = useSearchParams();
    const parentModule = params.get("parentModule");
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    const user = useAppSelector((state) => state.authReducer.userData);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            priority: 0,
            module: parentModule ? parentModule : undefined,
            startDate: new Date(),
            dueDate: currentDate,
            status: "TO_DO",
            reporter: user?.email,
        },
        mode: "onTouched",
    });

    function getMemberDetails({ email }: { email: string }) {
        const data = membersList.find((a) => a.info.email == email);

        if (data?.info) {
            return {
                email: data.info.email,
                username: data.info.username,
                name: data.info.name,
                avatar: data.info.avatar,
            };
        } else {
            return null;
        }
    }

    useEffect(() => {
        const service = new ModuleService();
        service
            .getModuleList()
            .exec()
            .then((response) => {
                logger.debug(response.data);
                setModules(response.data);
            });
    }, []);

    useEffect(() => {
        const service = new TeamService();
        service
            .getMembersList()
            .exec()
            .then((response) => {
                setMembersList(response.data as IAllMemberList[]);
            });
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const assignee = getMemberDetails({ email: values.assignee });
        if (!assignee) {
            toast({ description: "Assignee not found" });
            return;
        }

        const service = new TaskService();

        await makeApiCall(
            () => service.addTask({ ...values, assignee }).exec(),
            {
                toast,
                afterSuccess: () => {
                    router.back();
                    router.refresh();
                },
            }
        );
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
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">None</SelectItem>
                                        <SelectItem value="1">Low</SelectItem>
                                        <SelectItem value="2">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="3">High</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="module"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Module</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="No module" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {modules.map((module) => (
                                            <SelectItem
                                                key={module.id}
                                                value={module.id}>
                                                {module.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={"TO_DO"}>
                                        Todo
                                    </SelectItem>
                                    <SelectItem value={"ON_PROGRESS"}>
                                        On progress
                                    </SelectItem>
                                    <SelectItem value={"COMPLETED"}>
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Heading variant="form">Assignment</Heading>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="assignee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assignee</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a assignee" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {membersList.map((member) => (
                                            <SelectItem
                                                key={member.info.id}
                                                value={member.info.email}>
                                                {`${member.info.name}, ${member.info.email}`}
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
                        name="reporter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reporter</FormLabel>
                                <Select
                                    disabled={true}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    user
                                                        ? `${user.name}, ${user.email}`
                                                        : "You"
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value={user?.email || "you"}>
                                            {user?.email || "You"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="ms-auto flex w-fit gap-4">
                    <Button
                        onClick={() => router.back()}
                        type="button"
                        variant="muted">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={canSubmitFrom(form)}>
                        <AnimatedSpinner
                            isLoading={form.formState.isSubmitting}
                        />
                        <AddIcon /> Add
                    </Button>
                </div>
            </form>
        </Form>
    );
}
