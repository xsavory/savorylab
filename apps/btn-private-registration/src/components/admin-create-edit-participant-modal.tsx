import { useEffect } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useForm,
  zodResolver,
} from "@repo/react-components/ui";
import useCreateParticipant from "src/hooks/use-create-participant";
import useUpdateParticipant from "src/hooks/use-update-participant";
import type { Participant, AppwriteDocument } from "src/types/schema";

const participantSchema = z.object({
  name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

interface AdminCreateEditParticipantModalProps {
  participant?: AppwriteDocument<Participant>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AdminCreateEditParticipantModal({
  participant,
  open,
  onOpenChange,
}: AdminCreateEditParticipantModalProps) {
  const isEditMode = !!participant;
  const { createParticipant, isPending: isCreating, isSuccess: isCreateSuccess } = useCreateParticipant();
  const { updateParticipant, isPending: isUpdating, isSuccess: isUpdateSuccess } = useUpdateParticipant();

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: participant?.name || "",
    },
  });

  // Reset form when participant changes
  useEffect(() => {
    if (participant) {
      form.reset({
        name: participant.name,
      });
    }
  }, [participant, form]);

  // Close modal on success
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      onOpenChange(false);
      form.reset();
    }
  }, [isCreateSuccess, isUpdateSuccess, onOpenChange, form]);

  const onSubmit = (data: ParticipantFormData) => {
    if (isEditMode && participant) {
      updateParticipant({
        id: participant.$id,
        updates: {
          name: data.name,
        },
      });
    } else {
      createParticipant({
        name: data.name,
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-amber-400/30 backdrop-blur-sm text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-100">
            {isEditMode ? "Edit Participant" : "Add New Participant"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter participant name"
                      {...field}
                      disabled={isPending}
                      className="bg-black/20 border-amber-400/30 text-gray-100 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="bg-black/30 border-amber-400/30 text-gray-300 hover:bg-amber-500/20 hover:text-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update" : "Create"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminCreateEditParticipantModal;
