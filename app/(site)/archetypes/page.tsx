import { ArchetypeFolderGallery } from "@/components/archetype-folder-gallery"

export default function ArchetypesWikiPage() {
  return (
    <div className="mx-auto w-full max-w-[100rem] bg-[#CFF7FE] px-4 py-10">
      <div className="relative mx-auto w-fit">
        <span
          aria-hidden="true"
          className="absolute -left-6 -top-3 text-xl text-[#FF4D6D] drop-shadow-[1px_1px_0_#000]"
        >
          ✦
        </span>
        <span
          aria-hidden="true"
          className="absolute -right-5 -top-4 text-lg text-[#7B61FF] drop-shadow-[1px_1px_0_#000]"
        >
          ✧
        </span>
        <span
          aria-hidden="true"
          className="absolute -right-7 top-8 text-base text-[#00B8D9] drop-shadow-[1px_1px_0_#000]"
        >
          ✦
        </span>
        <div className="rounded-2xl border-4 border-black bg-white px-8 py-4 shadow-[6px_6px_0_0_#000]">
          <h1 className="font-personality text-balance text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Archetypes
          </h1>
        </div>
        <div className="absolute left-1/2 top-full z-10 -mt-1 w-[13rem] max-w-[78vw] -translate-x-[18%] rotate-[-10deg] rounded-md border-4 border-black bg-[#F8D548] px-3 py-1.5 text-center text-xs font-normal text-black shadow-[4px_4px_0_0_#000] sm:w-[15rem] sm:text-sm">
          Tab to see the details below.
        </div>
      </div>
      <div className="mt-20">
        <ArchetypeFolderGallery />
      </div>
    </div>
  )
}
