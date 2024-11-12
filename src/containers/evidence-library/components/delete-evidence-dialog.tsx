import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";
import * as React from "react";
import { toast } from "sonner";

// import { useMediaQuery } from "~/hooks/use-media-query";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";
import { useMediaQuery } from "~/hooks/use-media-query";
import type { IEvidence } from "../types";
// import { Evidence } from "../_lib/queries";

// import { deleteEvidences } from "../_lib/actions";

interface DeleteEvidenceDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  evidence: Row<IEvidence>["original"];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteEvidenceDialog({
  evidence,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
  ...props
}: DeleteEvidenceDialogProps) {
  const [isDeletePending, _startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    // startDeleteTransition(async () => {
    //   const { error } = await deleteEvidences({
    //     ids: evidences.map((task) => task.id),
    //   });
    //   if (error) {
    //     toast.error(error);
    //     return;
    //   }
    //   onOpenChange?.(false);
    //   toast.success("Evidences deleted");
    //   onSuccess?.();
    // });
  }
  //   console.log(evidence.id);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium">{evidence.id}</span> from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <ReloadIcon
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">(Evidence name)</span>
            from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
