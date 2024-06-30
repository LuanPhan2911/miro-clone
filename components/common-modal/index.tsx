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
};

export const CommonModal = ({
  title,
  description,
  children,
  isOpen,
}: Props) => {
  const { onClose } = useModal();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
export const CommonModalTrigger = ({
  data,
  type,
  children,
}: {
  data?: ModalData;
  type: ModalType;
  children: React.ReactNode;
}) => {
  const { onOpen } = useModal();
  const onClick = () => onOpen(type, data);

  return (
    <div className="h-fit w-fit" onClick={onClick}>
      {children}
    </div>
  );
};
