export function EditorStatus({
  dirty,
  status,
}: {
  dirty: boolean;
  status: string;
}) {
  return (
    <footer className="flex h-[34px] shrink-0 items-center justify-between border-t border-border px-[19px] text-[9px] text-muted max-[600px]:[&>span:last-child]:hidden">
      <span role="status">
        <span
          className={`mr-[7px] inline-block size-[5px] rounded-full align-middle ${dirty ? "bg-[#c29b4f]" : "bg-[#709675]"}`}
        />
        {status}
      </span>
      <span>Local draft · No server changes</span>
    </footer>
  );
}
