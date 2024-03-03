"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { changeInvitationStatus } from "@/services/team.service";
import { useSearchParams } from "next/navigation";

export default function page() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const message = searchParams.get("message");

    function handleAcceptInvitation() {
        if (!token) {
            toast({
                description: "No token found",
            });
            return;
        }
        changeInvitationStatus({
            token,
            invitationAccepted: true,
        })
            .then((response) => {
                toast({
                    description: response?.message || "Invitation accepted",
                });
            })
            .catch((error) => {
                toast({
                    title: "Invitation accepted failed",
                    description: error || "failed",
                });
            });
    }
    function handleRejectInvitation() {
        if (!token) {
            toast({
                description: "No token found",
            });
            return;
        }
        changeInvitationStatus({
            token,
            invitationAccepted: false,
        })
            .then((response) => {
                toast({
                    description: response?.message || "Invitation accepted",
                });
            })
            .catch((error) => {
                toast({
                    title: "Invitation accepted failed",
                    description: error || "failed",
                });
            });
    }

    return (
        <main className="grid min-h-[80vh] place-items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Project invitation</CardTitle>
                    <CardDescription>
                        {message || "Not message"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end gap-4">
                    <Button
                        onClick={handleRejectInvitation}
                        variant="secondary">
                        Reject
                    </Button>
                    <Button onClick={handleAcceptInvitation}>
                        Accept Invitation
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
