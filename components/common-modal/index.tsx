"use client";
import { ModalData, ModalType, useModal } from "@/stores/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {
  title: React.ReactNode | string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
};

export const CommonModal = ({
  title,
  description,
  children,
  isOpen,
  className,
}: Props) => {
  const { onClose } = useModal();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!!description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};
