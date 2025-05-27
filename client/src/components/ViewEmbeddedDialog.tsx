import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ViewEmbeddedDialogProps {
  url: string;
  className?: string;
}

export const ViewEmbeddedDialog = ({ url }: ViewEmbeddedDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-brand flex items-center w-fit hover:opacity-60">
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          View embedded
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-[80vw] w-[105ch] h-[80vh] p-0 border border-border rounded-2xl overflow-hidden">
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            colorScheme: "dark",
          }}
          title="Embedded thread view"
        />
      </DialogContent>
    </Dialog>
  );
};
