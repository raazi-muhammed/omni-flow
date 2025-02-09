import React from "react";
import RemoveMember from "./RemoveMemberFromTeam";
import MoveToTeamSelector from "./MoveToTeamSelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 as EdtiIcon } from "lucide-react";

export default function MemberActionDropDown({
    teamName,
    memberEmail,
    memberId,
    disableMoveTo = false,
    disableRemove = false,
}: {
    teamName: string;
    memberEmail: string;
    memberId: string;
    disableMoveTo?: boolean;
    disableRemove?: boolean;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="icon" variant="ghost">
                    <EdtiIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                <RemoveMember
                    disableRemove={disableRemove}
                    team={teamName}
                    memberId={memberId}
                />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                        disabled={disableMoveTo}
                        className={disableMoveTo ? "opacity-50" : ""}>
                        Move to
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <MoveToTeamSelector
                            fromTeam={teamName}
                            email={memberEmail}
                        />
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
