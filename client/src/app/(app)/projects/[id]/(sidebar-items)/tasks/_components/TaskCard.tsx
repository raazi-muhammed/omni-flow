import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ITask } from "@/types/database";
import moment from "moment";
import Link from "next/link";

export default function TaskCard({
    task,
    onHomeScreen = true,
}: {
    task: ITask;
    onHomeScreen?: boolean;
}) {
    return (
        <Card className="p-4">
            <Link href={onHomeScreen ? `tasks/${task.id}` : `${task.id}`}>
                <p className="hover:underline">{task.name}</p>
            </Link>
            <div className="flex justify-between">
                <Label>{moment(task.dueDate).format("ll")}</Label>
                <Badge className="ms-auto flex w-fit" variant="secondary">
                    {task.status}
                </Badge>
            </div>
        </Card>
    );
}
