import Island from '../components/Island.jsx'
import PageIntro from '../components/PageIntro.jsx'
import SiteLayout from '../components/SiteLayout.jsx'
import { groups, speciesCount } from '../data/stats.js'
import RecommendForm from '../islands/RecommendForm.jsx'
import { formatNumber } from '../lib/format.js'

export default function Recommend() {
  return (
    <SiteLayout currentPath="/recommend" member>
      <PageIntro id="recommend-title" overline="Recommendations" title="Find plants for your space">
        Answer a few questions about where the plant will live. We compare your answers with all{' '}
        {formatNumber(speciesCount)} plants and suggest up to five, each with a confidence score.
      </PageIntro>
      <section className="section section--compact">
        <div className="container">
          {/* Group names go in as props so the dataset never ships to the browser. */}
          <Island
            name="RecommendForm"
            component={RecommendForm}
            props={{ groups: groups.map(({ name }) => name).sort() }}
          />
        </div>
      </section>
    </SiteLayout>
  )
}
