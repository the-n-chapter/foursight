export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="relative mx-auto w-fit">
        <span
          aria-hidden="true"
          className="absolute -left-6 -top-2 rotate-[-12deg] rounded-md border-2 border-black bg-[#FFD400] px-2 text-sm shadow-[2px_2px_0_0_#000]"
        >
          ★
        </span>
        <h1 className="font-personality rounded-2xl border-4 border-black bg-white px-8 py-4 text-balance text-center text-4xl font-semibold tracking-tight text-foreground shadow-[6px_6px_0_0_#000] sm:text-5xl">
          FOURSIGHT
        </h1>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border-4 border-black bg-white p-6 leading-relaxed text-foreground shadow-[8px_8px_0_0_#000] sm:p-8">
        <p>
          Hi! We are team <strong>FOURSIGHT</strong> - a group of four students from the University of Turku, Aalto
          University, and the University of Helsinki.
        </p>
        <p className="mt-6">
          This project was created as part of the <strong>Geospatial Challenge Camp 2026</strong>. We are exploring how people
          might behave in emergency situations, such as evacuations, and how this information could help improve
          crisis preparedness.
        </p>
        <p className="mt-6">
          Through this game, you'll go through different scenarios and make choices based on what you think you
          would do. While it may feel like a personality test, your responses help us better understand real human
          behavior in uncertain situations. This information can support social and healthcare services in planning
          more effective and resilient responses.
        </p>
        <p className="mt-6">
          <span className="inline bg-[linear-gradient(transparent_58%,#FFEB3B_58%)] px-0.5 text-black">
            There are no right or wrong answers: just answer honestly and see what you get.
          </span>
        </p>
        <p className="mt-6 font-semibold">
          Thanks for being part of our project!
          <br />
          FOURSIGHT
        </p>
      </div>
    </div>
  )
}
