export function WorkspaceNavigation() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface px-4 pt-7 pb-5 min-[1550px]:w-60 max-[1100px]:w-[185px] max-[1100px]:px-[10px] max-[850px]:hidden">
      <div className="flex items-center gap-2 px-2 text-[25px] font-bold tracking-[-.9px] text-[#234b39]">
        <span className="h-[29px] w-[27px] rounded-[7px_7px_7px_1px] bg-[#285b44] text-center text-[23px] text-white">
          p
        </span>
        polaris
        <span className="mt-[7px] ml-1 text-[8px] font-semibold tracking-[1.8px] text-muted max-[1100px]:hidden">
          STUDIO
        </span>
      </div>
      <div className="mt-[30px] mb-7 flex items-center gap-[10px] rounded-[7px] border border-border bg-white px-[9px] py-3 text-[11px] font-semibold">
        <span className="grid size-[29px] place-items-center rounded-md border border-[#d9e2d7] bg-[#e9eee7]">
          P
        </span>
        <div>
          Polaris workspace<small>Process modelling</small>
        </div>
      </div>
      <p className="pl-3 text-[9px] tracking-[1.3px] text-muted">WORKSPACE</p>
      <div className="mt-[6px] flex items-center gap-[10px] rounded-md bg-[#e7efe8] p-3 text-[12px] font-semibold text-[#315d44]">
        <span>▦</span> Process library{" "}
        <span className="ml-auto text-[10px]">1</span>
      </div>
      <div className="my-[31px]">
        <span className="pl-3 text-[9px] tracking-[1.3px] text-muted">
          SAMPLE COLLECTION
        </span>
        <div className="py-[14px] pr-2 pl-[17px] text-[11px]">
          ⌁ &nbsp; Order fulfilment
        </div>
      </div>
      <div className="mt-auto border-t border-border px-[10px] pt-4 text-[11px] [&_small]:pl-[15px]">
        <span className="mr-[7px] inline-block size-[5px] rounded-full bg-[#709675] align-middle" />{" "}
        Personal sandbox<small>Explore, connect, and refine.</small>
      </div>
    </aside>
  );
}
