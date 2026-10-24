import Island from '../components/Island.jsx'
import PageIntro from '../components/PageIntro.jsx'
import SiteLayout from '../components/SiteLayout.jsx'
import IdentifyForm from '../islands/IdentifyForm.jsx'

export default function Identify() {
  return (
    <SiteLayout currentPath="/identify" member>
      <PageIntro id="identify-title" overline="Identify" title="Identify a plant from a photo">
        Upload a clear photo of a leaf, flower, fruit or bark. Plantiz asks Pl@ntNet which species it
        is and shows how confident the match is.
      </PageIntro>
      <section className="section section--compact">
        <div className="container">
          <Island name="IdentifyForm" component={IdentifyForm} />
        </div>
      </section>
    </SiteLayout>
  )
}
