import { ArchetypeFolderGallery } from "@/components/archetype-folder-gallery"

export default function ArchetypesWikiPage() {
  return (
    <div className="mx-auto w-full max-w-[100rem] px-4 py-10">
      <h1 className="font-personality text-balance text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Archetypes
      </h1>
      <div className="mt-4">
        <ArchetypeFolderGallery />
      </div>
    </div>
  )
}
